import requests
import math
import logging

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def fetch_nearby_from_overpass(lat, lng, radius_km, service_types):
    results = []
    
    # Map ROADSoS service types to Overpass QL node/way/relation tags
    type_mapping = {
        'hospital': [('amenity', 'hospital'), ('amenity', 'clinic')],
        'police': [('amenity', 'police')],
        'ambulance': [('emergency', 'ambulance_station'), ('amenity', 'hospital')],
        'towing': [('shop', 'car_repair'), ('craft', 'towing')],
        'puncture': [('shop', 'car_repair'), ('shop', 'tyres')],
        'showroom': [('shop', 'car')]
    }
    
    radius_m = int(radius_km * 1000)
    
    for s_type in service_types:
        tags = type_mapping.get(s_type, [])
        if not tags:
            continue
            
        # Build query for the tags
        query_elements = ""
        for k, v in tags:
            # We query nodes, ways, and relations
            query_elements += f'node["{k}"="{v}"](around:{radius_m},{lat},{lng});\n'
            query_elements += f'way["{k}"="{v}"](around:{radius_m},{lat},{lng});\n'
            query_elements += f'relation["{k}"="{v}"](around:{radius_m},{lat},{lng});\n'
            
        overpass_query = f"""
        [out:json][timeout:25];
        (
{query_elements}
        );
        out center;
        """
        
        url = "http://overpass-api.de/api/interpreter"
        headers = {
            'User-Agent': 'RoadSOS/1.0',
            'Accept': 'application/json'
        }
        try:
            response = requests.post(url, data={'data': overpass_query}, headers=headers)
            if response.status_code == 200:
                data = response.json()
                for element in data.get('elements', []):
                    tags_data = element.get('tags', {})
                    
                    # Extract location (from node directly, or from center for ways/relations)
                    element_lat = element.get('lat') or element.get('center', {}).get('lat')
                    element_lon = element.get('lon') or element.get('center', {}).get('lon')
                    
                    if element_lat is None or element_lon is None:
                        continue
                        
                    name = tags_data.get('name', f"Unknown {s_type.capitalize()}")
                    address = _build_address(tags_data)
                    phone = tags_data.get('phone') or tags_data.get('contact:phone') or "Not available"
                    place_id = f"osm_{element.get('type')}_{element.get('id')}"
                    
                    place = {
                        "place_id": place_id,
                        "name": name,
                        "type": s_type,
                        "address": address,
                        "phone": phone,
                        "maps_uri": f"https://www.openstreetmap.org/{element.get('type')}/{element.get('id')}",
                        "location": {
                            "type": "Point",
                            "coordinates": [element_lon, element_lat]
                        }
                    }
                    results.append(place)
            else:
                logging.error(f"Overpass API error for {s_type}: {response.status_code}")
                
        except Exception as e:
            logging.error(f"Exception fetching from Overpass API for {s_type}: {e}")
            
    # Deduplicate by place_id (since ambulance/hospital map to same things etc)
    unique_results = {p['place_id']: p for p in results}
    return list(unique_results.values())

def _build_address(tags):
    # Try to extract address components from OSM tags
    street = tags.get('addr:street', '')
    housenumber = tags.get('addr:housenumber', '')
    city = tags.get('addr:city', '')
    
    parts = []
    if housenumber or street:
        parts.append(f"{housenumber} {street}".strip())
    if city:
        parts.append(city)
        
    return ", ".join(parts) if parts else "Address not available"
