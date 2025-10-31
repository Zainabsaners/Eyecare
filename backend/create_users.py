import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eyecare.settings')
django.setup()

from django.contrib.auth import get_user_model
from articles.models import Article

User = get_user_model()

def create_users():
    # Create superuser (Achievers)
    superuser, created = User.objects.get_or_create(
        username='Achievers',
        defaults={
            'email': 'achievers.eyecare@gmail.com',
            'first_name': 'Achievers',
            'last_name': 'Team',
            'user_type': 'admin',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        superuser.set_password('achievers@123')
        superuser.save()
        print("✅ Created superuser: Achievers")

    # Create specialist (Stacy Kivindyo)
    specialist, created = User.objects.get_or_create(
        username='StacyKivindyo',
        defaults={
            'email': 'stacy.kivindyo@eyecare.com',
            'first_name': 'Stacy',
            'last_name': 'Kivindyo',
            'user_type': 'specialist'
        }
    )
    if created:
        specialist.set_password('stacy@123')
        specialist.save()
        print("✅ Created specialist: Stacy Kivindyo")

    # Create patients
    patients_data = [
        {'username': 'ZainabSaners', 'email': 'zainab.saners@example.com', 'password': 'zainab@123', 'first_name': 'Zainab', 'last_name': 'Saners'},
        {'username': 'HerineAdhiambo', 'email': 'herine.adhiambo@example.com', 'password': 'herine@123', 'first_name': 'Herine', 'last_name': 'Adhiambo'},
    ]
    
    for patient_data in patients_data:
        patient, created = User.objects.get_or_create(
            username=patient_data['username'],
            defaults={
                'email': patient_data['email'],
                'first_name': patient_data['first_name'],
                'last_name': patient_data['last_name'],
                'user_type': 'patient'
            }
        )
        if created:
            patient.set_password(patient_data['password'])
            patient.save()
            print(f"✅ Created patient: {patient_data['first_name']} {patient_data['last_name']}")
    
    return superuser, specialist

def create_articles(superuser, specialist):
    articles = [
        {
            'title': 'Welcome to EyeCare Vision AI Platform',
            'content': 'Our AI-powered platform helps you monitor eye health and connect with specialists for comprehensive eye care solutions in the Lake Basin region.',
            'author': specialist,  # Use User instance, not string
            'category': 'welcome'
        },
        {
            'title': 'Understanding Digital Eye Strain', 
            'content': 'With increased screen time, learn how to protect your eyes from digital strain with our simple prevention tips and regular checkups.',
            'author': superuser,  # Use User instance, not string
            'category': 'eye_care'
        }
    ]
    
    for article_data in articles:
        article, created = Article.objects.get_or_create(
            title=article_data['title'],
            defaults=article_data
        )
        if created:
            print(f"✅ Created article: {article.title}")

if __name__ == '__main__':
    print("Creating users...")
    superuser, specialist = create_users()
    
    print("\nCreating articles...")
    create_articles(superuser, specialist)
    
    print("\n🎉 All users and articles created successfully!")
    print("\n📋 Login Credentials:")
    print("Admin: Achievers / achievers@123")
    print("Specialist: StacyKivindyo / stacy@123")
    print("Patient 1: ZainabSaners / zainab@123")
    print("Patient 2: HerineAdhiambo / herine@123")