from flask import Flask, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api, Resource
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Note, Contact
from spellchecker import SpellChecker
from flask_migrate import Migrate

app = Flask(__name__)
app.secret_key = 'my_secret_key'
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://group_five:12345@localhost/note_taking'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
spell = SpellChecker()
api = Api(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

class UserResource(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(email=data['email'], password=generate_password_hash(data['password']))
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully!'}, 201

class LoginResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            user = User.query.filter_by(email=data['email']).first()
            if user and check_password_hash(user.password, data['password']):
                session['user_id'] = user.id
                return {'message': 'Login successful!'}, 200
            return {'message': 'Invalid email or password!'}, 401
        except Exception as e:
            print(f"Error: {e}")  # Log the error
            return {'message': 'Internal Server Error'}, 500
class LogoutResource(Resource):
    def post(self):
        session.pop('user_id', None)  # Remove user ID from session
        return {'message': 'Logout successful!'}, 200

class NoteResource(Resource):
    def get(self):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401

        notes = Note.query.filter_by(user_id=session['user_id']).all()
        notes_data = [{'id': note.id, 'title': note.title, 'content': note.content, 'tags': note.tags} for note in notes]
        return jsonify(notes_data), 200

    def post(self):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        
        data = request.get_json()
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({'message': 'Title and content are required'}), 400

        spelling_errors = check_spelling(data['content'])
        if spelling_errors:
            return jsonify({'message': 'Spelling mistakes found. Try again.', 'errors': spelling_errors}), 400
        
        try:
            new_note = Note(
                title=data['title'],
                content=data['content'],
                tags=data.get('tags', []),
                user_id=session['user_id']
            )
            db.session.add(new_note)
            db.session.commit()
            return jsonify({'message': 'Note created successfully!', 'note': {'id': new_note.id, 'title': new_note.title}}), 201
        except Exception as e:
            print(f"Error creating note: {e}")  # Log the error for debugging
            return jsonify({'message': 'Internal Server Error'}), 500

    def put(self, note_id):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401

        note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()
        if not note:
            return jsonify({'message': 'Note not found or access denied'}), 404

        data = request.get_json()
        note.title = data['title']
        note.content = data['content']
        note.tags = data.get('tags')
        db.session.commit()
        return jsonify({'message': 'Note updated successfully!'}), 200

    def delete(self, note_id):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401

        note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()
        if not note:
            return jsonify({'message': 'Note not found or access denied'}), 404

        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted successfully!'}), 200
class ContactResource(Resource):
    def post(self):
        data = request.get_json()
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            subject=data.get('subject', ''),
            message=data['message']
        )
        db.session.add(new_contact)
        db.session.commit()
        return {'message': 'Contact message sent successfully!'}, 201
    
    def get(self):
        contacts = Contact.query.all()
        return jsonify([{
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'subject': contact.subject,
            'message': contact.message
        } for contact in contacts]), 200

api.add_resource(UserResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(NoteResource, '/notes', '/notes/<int:note_id>')
api.add_resource(ContactResource, '/contact')

def check_spelling(text):
    misspelled = spell.unknown(text.split())
    return {word: spell.candidates(word) for word in misspelled}

if __name__ == '__main__':
    app.run(port=5000, debug=True)

