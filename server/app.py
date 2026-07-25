from flask import Flask
from flask_cors import CORS
from config import Config
from routes.places import places_bp
from models.placeModel import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # Initialize Database
    init_db(app.config['MONGO_URI'])

    from routes.places import places_bp
    from routes.auth import auth_bp
    from routes.sos import sos_bp
    
    app.register_blueprint(places_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(sos_bp, url_prefix='/api/sos')

    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'ROADSoS API is running'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)
