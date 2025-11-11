from django.db import migrations
from django.utils.text import slugify


CATEGORIES = [
    "Электроника",
    "Недвижимость",
    "Транспорт",
    "Услуги",
    "Дом и сад",
    "Хобби и отдых",
    "Работа",
    "Животные",
    "Для детей",
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model("api", "Category")

    for name in CATEGORIES:
        # Keep UX predictable: avoid duplicates by name; compute a unique slug if needed.
        obj, created = Category.objects.get_or_create(name=name)
        if created or not obj.slug:
            base_slug = slugify(name, allow_unicode=True) or "category"
            slug = base_slug
            i = 2
            while Category.objects.filter(slug=slug).exclude(pk=obj.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            obj.slug = slug
            obj.save(update_fields=["slug"])


def unseed_categories(apps, schema_editor):
    Category = apps.get_model("api", "Category")
    Ad = apps.get_model("api", "Ad")

    for cat in Category.objects.filter(name__in=CATEGORIES):
        # Do not remove if category is in use by any ads.
        if not Ad.objects.filter(category_id=cat.id).exists():
            cat.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed_categories),
    ]
