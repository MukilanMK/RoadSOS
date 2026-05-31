from flask import Blueprint, request, jsonify
from controllers.placesController import get_nearby_services
from config import Config

places_bp = Blueprint('places', __name__)

@places_bp.route('/nearby', methods=['GET'])
def get_nearby():
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', type=int, default=Config.DEFAULT_SEARCH_RADIUS_KM)
        
        service_types_str = request.args.get('service_types', '')
        service_types = service_types_str.split(',') if service_types_str else []
        
        if lat is None or lng is None:
            return jsonify({
                "success": False,
                "error": "Invalid or missing latitude/longitude",
                "code": "INVALID_COORDINATES"
            }), 400
            
        result, status_code = get_nearby_services(lat, lng, radius, service_types)
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "code": "BAD_REQUEST"
        }), 400
