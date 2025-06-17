from django.contrib import admin
from .models import Event
from budget.models import Budget
from django.utils.html import format_html
from django.urls import path, reverse
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages

admin.site.site_header = "AURAK Event Management Platform"
admin.site.site_title = "AURAK Event Management Platform"
admin.site.index_title = "Welcome to the Admin Panel"

class BudgetInline(admin.TabularInline):
    model = Budget
    extra = 0
    readonly_fields = ('change_status',)

    def change_status(self, obj):
        if obj.pk:
            grant_url = reverse('admin:grant_budget', args=[obj.pk])
            deny_url = reverse('admin:deny_budget', args=[obj.pk])
            return format_html(
                '<a class="button" style="margin-right:5px;" href="{}">✅ Grant</a>'
                '<a class="button" style="color:red;" href="{}">❌ Deny</a>',
                grant_url, deny_url
            )
        return ""
    change_status.short_description = "Actions"

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'host', 'start_date', 'status', 'category',
        'department','target_audience'
    )
    list_filter = ('status', 'department', 'category')
    search_fields = ('name', 'host', 'department', 'category', 'target_audience')
    inlines = [BudgetInline]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('budget/grant/<int:budget_id>/', self.admin_site.admin_view(self.grant_budget), name='grant_budget'),
            path('budget/deny/<int:budget_id>/', self.admin_site.admin_view(self.deny_budget), name='deny_budget'),
            path('event/approve/<int:event_id>/', self.admin_site.admin_view(self.approve_event), name='approve_event'),
            path('event/deny/<int:event_id>/', self.admin_site.admin_view(self.deny_event), name='deny_event'),
        ]
        return custom_urls + urls

    def grant_budget(self, request, budget_id):
        budget = get_object_or_404(Budget, pk=budget_id)
        budget.budget_status = "Granted"
        budget.save()
        messages.success(request, f"Budget '{budget}' marked as GRANTED.")
        return redirect(request.META.get('HTTP_REFERER', '/admin/'))

    def deny_budget(self, request, budget_id):
        budget = get_object_or_404(Budget, pk=budget_id)
        budget.budget_status = "Denied"
        budget.save()
        messages.success(request, f"Budget '{budget}' marked as DENIED.")
        return redirect(request.META.get('HTTP_REFERER', '/admin/'))

    def approve_event(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        event.status = "Approved"
        event.save()
        messages.success(request, f"Event '{event}' marked as APPROVED.")
        return redirect(f'/admin/events/event/{event_id}/change/')

    def deny_event(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        event.status = "Denied"
        event.save()
        messages.success(request, f"Event '{event}' marked as DENIED.")
        return redirect(f'/admin/events/event/{event_id}/change/')

    def get_fieldsets(self, request, obj=None):
        fieldsets = [
            (None, {
                'fields': [
                    'name', 'start_time', 'end_time',
                    'start_date', 'end_date',
                    'description', 'host',
                    'venue', 'location',
                    'category', 'department',
                    'goals',
                    'expected_students',
                    'expected_faculty',
                    'expected_community',
                    'expected_others',
                    'target_audience',
                ]
            }),
            ('Status Actions', {
                'fields': ['status'],
                'description': self.status_actions(obj) if obj else ''
            }),
        ]
        return fieldsets

    def status_actions(self, obj):
        if not obj:
            return ""
        approve_url = reverse('admin:approve_event', args=[obj.pk])
        deny_url = reverse('admin:deny_event', args=[obj.pk])
        return format_html(
            '<a class="button" style="margin-right:10px;" href="{}">✅ Approve</a>'
            '<a class="button" style="color:red;" href="{}">❌ Deny</a>',
            approve_url, deny_url
        )
