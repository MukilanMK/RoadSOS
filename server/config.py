import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/roadsos')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    DEFAULT_SEARCH_RADIUS_KM = int(os.getenv('DEFAULT_SEARCH_RADIUS_KM', 5))
    CACHE_EXPIRY_HOURS = int(os.getenv('CACHE_EXPIRY_HOURS', 24))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    ENV = os.getenv('FLASK_ENV', 'production')
