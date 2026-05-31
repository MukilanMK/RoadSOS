from models.placeModel import get_places_within_radius, upsert_places
from utils.overpassApi import fetch_nearby_from_overpass, calculate_distance
from config import Config
from datetime import datetime, timezone
import logging

def get_nearby_services(lat, lng, radius_km, service_types):
    if not service_types:
        service_types = ['hospital', 'police', 'ambulance', 'towing', 'puncture']
        
    try:
        # 1. Check MongoDB for cached data
        cached_places = get_places_within_radius(lng, lat, radius_km, service_types)
        
        # Determine which service types are adequately covered in cache
        # For simplicity, if we have fewer than 2 results for a requested type, we fetch from Google
        types_to_fetch = []
        for s_type in service_types:
            count = sum(1 for p in cached_places if p['type'] == s_type)
            if count < 2:
                types_to_fetch.append(s_type)
                
        # 2. Call Overpass API if needed
        if types_to_fetch:
            new_places = fetch_nearby_from_overpass(lat, lng, radius_km, types_to_fetch)
            if new_places:
                upsert_places(new_places)
                # Re-fetch from DB to include newly inserted data
                cached_places = get_places_within_radius(lng, lat, radius_km, service_types)
                
        # 3. Format and sort results
        results = []
        for p in cached_places:
            p_lng = p['location']['coordinates'][0]
            p_lat = p['location']['coordinates'][1]
            dist = calculate_distance(lat, lng, p_lat, p_lng)
            
            # Remove MongoDB internal fields
            if '_id' in p:
                del p['_id']
                
            p['distance_km'] = dist
            p['cached'] = True # Hardcoded for now
            results.append(p)
            
        # Sort by distance
        results.sort(key=lambda x: x['distance_km'])
        
        return {
            "success": True,
            "data": results,
            "cached_from": datetime.now(timezone.utc).isoformat(),
            "search_info": {
                "lat": lat,
                "lng": lng,
                "radius_km": radius_km,
                "services_found": len(results)
            }
        }, 200
        
    except Exception as e:
        logging.error(f"Error in get_nearby_services: {e}")
        return {
            "success": False,
            "error": "Internal server error",
            "code": "INTERNAL_ERROR"
        }, 500
