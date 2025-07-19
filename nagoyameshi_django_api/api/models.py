from django.db import models
from django.conf import settings
from django.db.models import Avg

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="カテゴリ名")

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=200, verbose_name="店舗名")
    description = models.TextField(verbose_name="説明")
    image = models.ImageField(upload_to='restaurants/', verbose_name="店舗画像", null=True, blank=True)
    address = models.CharField(max_length=255, verbose_name="住所")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="カテゴリ")

    def __str__(self):
        return self.name

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return reviews.aggregate(Avg('rating'))['rating__avg']
        return 0

class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews', verbose_name="店舗")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="ユーザー")
    rating = models.IntegerField(verbose_name="評価", choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(verbose_name="コメント")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="投稿日時")

    class Meta:
        # 同一ユーザー／同一店舗のユニーク制約を削除しました
        pass

    def __str__(self):
        return f'{self.restaurant.name} - {self.user.email}'

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="ユーザー")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, verbose_name="店舗")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="登録日時")

    class Meta:
        unique_together = ('user', 'restaurant')

    def __str__(self):
        return f'{self.user.email} - {self.restaurant.name}'

class Reservation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="ユーザー")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, verbose_name="店舗")
    reservation_date = models.DateField(verbose_name="予約日")
    reservation_time = models.TimeField(verbose_name="予約時間")
    number_of_people = models.PositiveIntegerField(verbose_name="予約人数")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")

    class Meta:
        unique_together = ('user', 'restaurant', 'reservation_date', 'reservation_time')

    def __str__(self):
        return f'{self.restaurant.name} - {self.user.email} - {self.reservation_date} {self.reservation_time}'
