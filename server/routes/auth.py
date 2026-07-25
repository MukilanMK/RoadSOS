from flask import Blueprint, request, jsonify, current_app
from models.userModel import create_user, find_user_by_email, update_user_distress_emails
from utils.auth_middleware import token_required
import bcrypt
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Required fields
    required_fields = ['name', 'phone', 'email', 'dob', 'age', 'gender', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing field: {field}'}), 400
            
    # Check if user already exists
    if find_user_by_email(data['email']):
        return jsonify({'message': 'User already exists!'}), 409
        
    # Hash password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user_data = {
        'name': data['name'],
        'phone': data['phone'],
        'email': data['email'],
        'dob': data['dob'],
        'age': data['age'],
        'gender': data['gender'],
        'password': hashed_password.decode('utf-8'),
        'distress_emails': []
    }
    
    create_user(user_data)
    
    return jsonify({'message': 'User registered successfully!'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = find_user_by_email(data['email'])
    
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
        
    # Check password
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        # Generate token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    user_data = {
        'name': current_user.get('name'),
        'email': current_user.get('email'),
        'phone': current_user.get('phone'),
        'dob': current_user.get('dob'),
        'age': current_user.get('age'),
        'gender': current_user.get('gender'),
        'distress_emails': current_user.get('distress_emails', [])
    }
    return jsonify(user_data), 200

@auth_bp.route('/distress-emails', methods=['POST'])
@token_required
def add_distress_email(current_user):
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
        
    distress_emails = current_user.get('distress_emails', [])
    if email not in distress_emails:
        distress_emails.append(email)
        update_user_distress_emails(str(current_user['_id']), distress_emails)
        
    return jsonify({'distress_emails': distress_emails}), 200

@auth_bp.route('/distress-emails', methods=['DELETE'])
@token_required
def remove_distress_email(current_user):
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
        
    distress_emails = current_user.get('distress_emails', [])
    if email in distress_emails:
        distress_emails.remove(email)
        update_user_distress_emails(str(current_user['_id']), distress_emails)
        
    return jsonify({'distress_emails': distress_emails}), 200
