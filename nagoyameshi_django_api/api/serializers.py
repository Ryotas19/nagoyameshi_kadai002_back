from rest_framework import serializers
from .models import Restaurant, Review, Category, Favorite, Reservation

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ReviewSerializer(serializers.ModelSerializer):
    # 投稿者のIDを含めるように追加
    user = serializers.IntegerField(source='user.id', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'user',          # ユーザーID
            'user_username', # ユーザー名
            'rating',
            'comment',
            'created_at',
            'restaurant',
        ]
        read_only_fields = ['user']  # userは自動でセット

class RestaurantSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    is_favorited = serializers.SerializerMethodField()
    image = serializers.ImageField(read_only=True, use_url=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'image', 'address',
            'reviews', 'category_name', 'avg_rating',
            'category', 'is_favorited',
        ]

    def get_is_favorited(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Favorite.objects.filter(restaurant=obj, user=user).exists()
        return False

class FavoriteSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)
    class Meta:
        model = Favorite
        fields = ['id', 'restaurant']

class ReservationSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    class Meta:
        model = Reservation
        fields = [
            'id', 'restaurant', 'restaurant_name',
            'reservation_date', 'reservation_time', 'number_of_people'
        ]
        read_only_fields = ['user']  # userは自動で設定
