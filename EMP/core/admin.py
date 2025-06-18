from django.contrib import admin
from .models import Tag, PermissionLevel, PermissionType, Role, PermissionLevelType

# @admin.register(Tag)
# class TagAdmin(admin.ModelAdmin):
#     list_display = ("name", "description")

# @admin.register(PermissionLevel)
# class PermissionLevelAdmin(admin.ModelAdmin):
#     list_display = ("level",)

# @admin.register(PermissionType)
# class PermissionTypeAdmin(admin.ModelAdmin):
#     list_display = ("type",)

# @admin.register(Role)
# class RoleAdmin(admin.ModelAdmin):
#     list_display = ("name", "permission_level")

# @admin.register(PermissionLevelType)
# class PermissionLevelTypeAdmin(admin.ModelAdmin):
#     list_display = ("permission_level", "permission_type")
