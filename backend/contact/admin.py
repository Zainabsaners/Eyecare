from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'status', 'assigned_to', 'created_at')
    list_filter = ('status', 'created_at', 'assigned_to')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Message Information', {
            'fields': ('name', 'email', 'subject', 'message')
        }),
        ('Management', {
            'fields': ('status', 'assigned_to')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_in_progress', 'mark_as_resolved']
    
    def mark_as_in_progress(self, request, queryset):
        queryset.update(status='in_progress')
    mark_as_in_progress.short_description = "Mark selected messages as In Progress"
    
    def mark_as_resolved(self, request, queryset):
        queryset.update(status='resolved')
    mark_as_resolved.short_description = "Mark selected messages as Resolved"
