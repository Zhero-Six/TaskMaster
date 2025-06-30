from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from models import db
from auth import auth_bp
from routes import api_bp
import os

load_dotenv()

app = Flask(__name__)

# === Step 1.4: Updated CORS Configuration ===
CORS(app, resources={r"/api/*": {"origins": "https://task-master.vercel.app"}})

# === Configuration ===
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# === Extensions ===
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)

# === Blueprints ===
app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)

# === Routes ===
@app.route('/')
def index():
    return {'message': 'Welcome to TaskMaster API root route'}

@app.route('/api')
def home():
    return {'message': 'TaskMaster API'}

# === Main Runner ===
if __name__ == '__main__':
    app.run(debug=True, port=5000)
