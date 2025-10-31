#!/usr/bin/env bash
set -o errexit

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Making database migrations ==="
python manage.py makemigrations --noinput

echo "=== Applying database migrations ==="
python manage.py migrate --noinput

echo "=== Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== Build completed successfully! ==="
# After migrations
python manage.py shell -c "
from django.contrib.auth import get_user_model
from articles.models import Article
User = get_user_model()

# Create users if they don't exist
if not User.objects.filter(username='Achievers').exists():
    User.objects.create_superuser('Achievers', 'achievers.eyecare@gmail.com', 'achievers@123')
    User.objects.create_user('StacyKivindyo', 'stacy.kivindyo@eyecare.com', 'stacy@123', first_name='Stacy', last_name='Kivindyo', user_type='specialist')
    User.objects.create_user('ZainabSaners', 'zainab.saners@example.com', 'zainab@123', first_name='Zainab', last_name='Saners', user_type='patient')
    User.objects.create_user('HerineAdhiambo', 'herine.adhiambo@example.com', 'herine@123', first_name='Herine', last_name='Adhiambo', user_type='patient')
    print('✅ Initial users created!')
"