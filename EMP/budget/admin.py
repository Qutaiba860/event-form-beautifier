from django.contrib import admin
from .models import Budget

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'item_quantity', 'item_cost', 'total_cost', 'budget_status', 'event')
    search_fields = ('item_name', 'event__name')
    list_filter = ('budget_status',)