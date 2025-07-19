# settings.py

from pathlib import Path
from datetime import timedelta
import os
import environ 
import dj_database_url

# ── プロジェクトのルートパス
BASE_DIR = Path(__file__).resolve().parent.parent

# ── .env を読み込む
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# ── 環境変数から取得
SECRET_KEY            = env('SECRET_KEY')
DEBUG                 = env('DEBUG')
ALLOWED_HOSTS         =env.list('ALLOWED_HOSTS')

INSTALLED_APPS = [
    'django.contrib.admin','django.contrib.auth','django.contrib.contenttypes',
    'django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework','corsheaders','allauth','allauth.account',
    'allauth.socialaccount','dj_rest_auth','dj_rest_auth.registration',
    'django_filters','accounts','api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    'default': dj_database_url.config(
        default=env('DATABASE_URL'),  
        conn_max_age=600,
        ssl_require=True
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ja"
TIME_ZONE = "Asia/Tokyo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Heroku静的ファイル対応
STATIC_ROOT = BASE_DIR / 'static'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL     = 'accounts.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

SIMPLE_JWT    = { 'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60) }
REST_USE_JWT  = True

SITE_ID                       = 1
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED     = True
ACCOUNT_EMAIL_REQUIRED        = True
ACCOUNT_EMAIL_VERIFICATION    = 'none'
REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'accounts.serializers.CustomUserDetailsSerializer',
    'TOKEN_MODEL': None,
    'USE_JWT': True,
    'JWT_AUTH_HTTPONLY': False,
}

EMAIL_BACKEND         = 'django.core.mail.backends.console.EmailBackend'


CORS_ALLOWED_ORIGINS = [
    "https://nagoyameshi-frontend-6f2d33c9455f.herokuapp.com",
]

# Stripe
STRIPE_SECRET_KEY     = env('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')

# フロントエンド側 URL
FRONTEND_URL          = env('FRONTEND_URL')


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'
ACCOUNT_ADAPTER = 'allauth.account.adapter.DefaultAccountAdapter'

# HerokuのHTTPS対応
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
