import requests
import math
import logging
from config import Config

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def fetch_nearby_from_ola(lat, lng, radius_km, service_types):
    results = []
    api_key = Config.OLA_MAPS_API_KEY
    
    # Map ROADSoS service types to Ola Maps types/keywords
    type_mapping = {
        'hospital': 'hospital',
        'police': 'police',
        'towing': 'car_repair',
        'puncture': 'car_repair',
        'showroom': 'car_dealer'
    }
    
    if not api_key:
        logging.error("No Ola Maps API key available.")
        return []

    # Mock functionality for testing
    if api_key == 'mock_ola_maps_key':
        logging.info("Using mocked Ola Maps key. Returning mock data.")
        return get_mock_data(lat, lng, radius_km, service_types)

    radius_m = int(radius_km * 1000)
    
    for s_type in service_types:
        search_type = type_mapping.get(s_type, s_type)
        
        url = "https://api.olamaps.io/places/v1/nearbysearch"
        params = {
            'location': f"{lat},{lng}",
            'types': search_type,
            'radius': radius_m,
            'api_key': api_key
        }

        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                predictions = data.get('predictions', [])
                
                for place in predictions:
                    place_id = place.get('place_id')
                    ola_place_id = f"ola_{place_id}"
                    
                    # Fetch details for coordinates
                    details_url = "https://api.olamaps.io/places/v1/details"
                    details_params = {
                        'place_id': place_id,
                        'api_key': api_key
                    }
                    try:
                        det_resp = requests.get(details_url, params=details_params)
                        if det_resp.status_code == 200:
                            det_data = det_resp.json().get('result', {})
                            location = det_data.get('geometry', {}).get('location', {})
                            place_lat = location.get('lat')
                            place_lng = location.get('lng')
                            address = det_data.get('formatted_address', place.get('description', 'Address not available'))
                            
                            if place_lat is None or place_lng is None:
                                continue
                                
                            phone = det_data.get('formatted_phone_number')
                            if not phone or phone == "NA":
                                phone = "Not available"
                                
                            p = {
                                "place_id": ola_place_id,
                                "name": place.get('structured_formatting', {}).get('main_text') or det_data.get('name', f"Unknown {s_type.capitalize()}"),
                                "type": s_type,
                                "address": address,
                                "phone": phone,
                                "maps_uri": f"https://www.google.com/maps/dir/?api=1&destination={place_lat},{place_lng}",
                                "location": {
                                    "type": "Point",
                                    "coordinates": [float(place_lng), float(place_lat)]
                                }
                            }
                            results.append(p)
                    except Exception as det_e:
                        logging.error(f"Error fetching details for {place_id}: {det_e}")
                        
            else:
                logging.error(f"Ola Maps API error for {s_type}: {response.status_code} - {response.text}")
                
        except Exception as e:
            logging.error(f"Exception fetching from Ola Maps API for {s_type}: {e}")
            
    # Deduplicate by place_id
    unique_results = {p['place_id']: p for p in results}
    return list(unique_results.values())

def get_mock_data(lat, lng, radius_km, service_types):
    results = []
    for s_type in service_types:
        results.append({
            "place_id": f"mock_ola_{s_type}_1",
            "name": f"Mocked Ola {s_type.capitalize()} 1",
            "type": s_type,
            "address": "456 Ola Street",
            "phone": "0987654321",
            "maps_uri": f"https://www.google.com/maps/dir/?api=1&destination={lat + 0.01},{lng + 0.01}",
            "location": {
                "type": "Point",
                "coordinates": [lng + 0.01, lat + 0.01]
            }
        })
    return results
