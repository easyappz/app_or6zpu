from django.db import models


class Member(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, unique=True)
    avatar_url = models.URLField(blank=True)
    password_hash = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.email})"


class Category(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='children',
    )

    def __str__(self) -> str:
        return self.name


class Ad(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Новый'),
        ('like_new', 'Как новый'),
        ('used', 'Б/у'),
        ('for_parts', 'На запчасти'),
    ]

    owner = models.ForeignKey('Member', on_delete=models.CASCADE, related_name='ads')
    category = models.ForeignKey('Category', on_delete=models.PROTECT, related_name='ads')
    title = models.CharField(max_length=140)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    photos = models.JSONField(default=list)
    location = models.CharField(max_length=140)
    contact = models.CharField(max_length=140)
    condition = models.CharField(max_length=16, choices=CONDITION_CHOICES, default='used')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class Favorite(models.Model):
    member = models.ForeignKey('Member', on_delete=models.CASCADE, related_name='favorites')
    ad = models.ForeignKey('Ad', on_delete=models.CASCADE, related_name='favorites')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['member', 'ad'], name='unique_favorite_member_ad'),
        ]

    def __str__(self) -> str:
        return f"Favorite(member={self.member_id}, ad={self.ad_id})"
