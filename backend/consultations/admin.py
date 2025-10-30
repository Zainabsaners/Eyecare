from django.contrib import admin
from .models import Consultation

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'specialist', 'status', 'scheduled_date', 'created_at')
    list_filter = ('status', 'scheduled_date')
    search_fields = ('user__username', 'specialist__username', 'description')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Consultation Information', {
            'fields': ('user', 'specialist', 'scan', 'description', 'status')
        }),
        ('Scheduling', {
            'fields': ('scheduled_date',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
