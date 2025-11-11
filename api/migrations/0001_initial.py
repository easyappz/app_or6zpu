from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.CharField(max_length=32, unique=True)),
                ('avatar_url', models.URLField(blank=True)),
                ('password_hash', models.CharField(max_length=256)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('slug', models.SlugField(unique=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='api.category')),
            ],
        ),
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=140)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('photos', models.JSONField(default=list)),
                ('location', models.CharField(max_length=140)),
                ('contact', models.CharField(max_length=140)),
                ('condition', models.CharField(choices=[('new', 'Новый'), ('like_new', 'Как новый'), ('used', 'Б/у'), ('for_parts', 'На запчасти')], default='used', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.category')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ads', to='api.member')),
            ],
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='api.ad')),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='api.member')),
            ],
        ),
        migrations.AddConstraint(
            model_name='favorite',
            constraint=models.UniqueConstraint(fields=('member', 'ad'), name='unique_favorite_member_ad'),
        ),
    ]
