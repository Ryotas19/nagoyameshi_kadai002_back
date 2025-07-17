from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # UserAdminを継承して、必要なフィールドを追加・変更する
    list_display = ('email', 'is_staff', 'plan', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'groups', 'plan')
    search_fields = ('email',)
    ordering = ('-date_joined',)
    
    # 編集ページのフィールド設定
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Plan Info', {'fields': ('plan', 'stripe_customer_id', 'stripe_subscription_id')}),
    )
    # 新規作成ページのフィールド設定
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2'),
        }),
    )
