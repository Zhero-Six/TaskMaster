from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from bcrypt import hashpw, gensalt, checkpw
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    password_hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')
    user = User(username=username, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        }
    }), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401

    # FIXED: Convert user.id to a string for the JWT "sub" field
    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }), 200

@auth_bp.route('/api/password-reset', methods=['POST'])
def password_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    # In production, send a password reset email here
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
