from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db
from auth import auth_bp
from routes import api_bp
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Debug: Print configuration
print(f"SECRET_KEY: {app.config['SECRET_KEY']}")
print(f"DATABASE_URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
print(f"JWT_SECRET_KEY: {app.config['JWT_SECRET_KEY']}")

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)

# Initialize database tables
with app.app_context():
    print("Creating database tables...")
    try:
        db.create_all()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database: {e}")

# Root route
@app.route('/')
def index():
    return {'message': 'Welcome to TaskMaster API root route'}

@app.route('/api')
def home():
    return {'message': 'TaskMaster API'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)