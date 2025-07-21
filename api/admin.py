from django import forms
from django.contrib import admin
from .models import Restaurant, Review, Category, Favorite, Reservation

class RestaurantForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = '__all__'

class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_range', 'price_min', 'category')
    form = RestaurantForm
    fields = ('name', 'price_range', 'price_min', 'description', 'image', 'address', 'category')

admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(Review)
admin.site.register(Category)
admin.site.register(Favorite)
admin.site.register(Reservation)