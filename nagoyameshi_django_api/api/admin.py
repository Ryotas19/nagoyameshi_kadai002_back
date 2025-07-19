
from django.contrib import admin
from .models import Restaurant, Review, Category, Favorite, Reservation

admin.site.register(Restaurant)
admin.site.register(Review)
admin.site.register(Category)
admin.site.register(Favorite)
admin.site.register(Reservation)