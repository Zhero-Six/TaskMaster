import pytest
from app import app, db
from models import User, Project, Task, Category, TaskCategory
from bcrypt import hashpw, gensalt
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_register(client):
    response = client.post('/api/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'securePassword123'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'User registered successfully'

def test_login(client):
    client.post('/api/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'securePassword123'
    })
    response = client.post('/api/login', json={
        'email': 'test@example.com',
        'password': 'securePassword123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_get_projects(client):
    response = client.get('/api/projects')
    assert response.status_code == 200
    assert 'projects' in response.json

def test_create_project(client):
    client.post('/api/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'securePassword123'
    })
    login_response = client.post('/api/login', json={
        'email': 'test@example.com',
        'password': 'securePassword123'
    })
    token = login_response.json['access_token']
    response = client.post('/api/projects', json={
        'title': 'Test Project',
        'description': 'Test Description'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    assert response.json['message'] == 'Project created successfully'