from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token
from models import db, User, PasswordResetToken
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime, timedelta
import secrets

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

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }), 200

@auth_bp.route('/api/password-reset', methods=['POST'])
def password_reset():
    from app import mail  # Move import here to avoid circular import
    from flask_mail import Message

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    token_entry = PasswordResetToken(token=reset_token, user_id=user.id, expires_at=expires_at)
    db.session.add(token_entry)
    db.session.commit()

    # Send email
    reset_url = url_for('auth.reset_password', token=reset_token, _external=True)
    msg = Message('Password Reset Request', recipients=[email])
    msg.body = f'Click the link to reset your password: {reset_url}\nThis link expires in 1 hour.'
    try:
        mail.send(msg)
        return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
    except Exception as e:
        db.session.delete(token_entry)
        db.session.commit()
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

@auth_bp.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    password = data.get('password')
    if not password or len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    token_entry = PasswordResetToken.query.filter_by(token=token).first()
    if not token_entry or token_entry.expires_at < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired reset token'}), 400

    user = User.query.get_or_404(token_entry.user_id)
    user.password_hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')
    db.session.delete(token_entry)
    db.session.commit()

    return jsonify({'message': 'Password reset successfully'}), 200