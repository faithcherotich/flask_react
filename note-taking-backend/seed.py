from app import create_app
from models import db, User, Note, EditorContent, ContactMessage  # Import the ContactMessage model

app = create_app()

def seed():
    with app.app_context():
        # Drop all tables and create new ones (use cautiously)
        db.drop_all()
        db.create_all()

        # Seed users
        users = [
            {'username': 'user1', 'password': 'password1'},
            {'username': 'user2', 'password': 'password2'}
        ]

        for user_data in users:
            if not User.query.filter_by(username=user_data['username']).first():
                user = User(username=user_data['username'])
                user.password = user_data['password']  # Use the password setter for hashing
                db.session.add(user)

        db.session.commit()  # Commit users first

        # Seed notes and editor content for user1
        user1 = User.query.filter_by(username='user1').first()  # Fetch user after seeding
        notes = [
            {
                'title': 'First Note',
                'content': 'This is the first note.',
                'tags': ['example', 'first'],
                'images': ['http://example.com/image1.jpg'],
                'videos': ['http://example.com/video1.mp4'],
                'user_id': user1.id
            },
            {
                'title': 'Second Note',
                'content': 'This is the second note.',
                'tags': ['example', 'second'],
                'images': ['http://example.com/image2.jpg'],
                'videos': ['http://example.com/video2.mp4'],
                'user_id': user1.id
            },
        ]

        for note_data in notes:
            if not Note.query.filter_by(title=note_data['title']).first():
                note = Note(title=note_data['title'], user_id=note_data['user_id'], tags=note_data['tags'])
                db.session.add(note)
                db.session.commit()  # Commit the note to get its ID

                # Add editor content for the note
                editor_content = EditorContent(
                    note_id=note.id,
                    content=note_data['content'],
                    images=note_data['images'],
                    videos=note_data['videos']
                )
                db.session.add(editor_content)

        db.session.commit()  # Commit editor content

        # Seed contact messages
        contact_messages = [
            {
                'name': 'John Doe',
                'email': 'john@example.com',
                'subject': 'Inquiry',
                'message': 'I would like to know more about your services.'
            },
            {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'subject': 'Feedback',
                'message': 'I really enjoy using your application!'
            }
        ]

        for contact_data in contact_messages:
            contact_message = ContactMessage(
                name=contact_data['name'],
                email=contact_data['email'],
                subject=contact_data['subject'],
                message=contact_data['message']
            )
            db.session.add(contact_message)

        db.session.commit()  # Commit contact messages
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
