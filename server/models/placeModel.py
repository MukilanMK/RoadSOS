from pymongo import MongoClient, GEOSPHERE
from pymongo.errors import ConnectionFailure
from datetime import datetime, timezone
import logging

db = None
places_collection = None

def init_db(uri):
    global db, places_collection
    try:
        client = MongoClient(uri)
        # Test connection
        client.admin.command('ping')
        db = client.get_default_database()
        if db.name == 'test' and 'roadsos' in uri:
            db = client.roadsos
        elif not db.name:
            db = client.roadsos
            
        places_collection = db.places
        
        # Create indexes
        places_collection.create_index([("location", GEOSPHERE)])
        places_collection.create_index("place_id", unique=True)
        logging.info("Connected to MongoDB and ensured indexes")
    except ConnectionFailure as e:
        logging.error(f"Could not connect to MongoDB: {e}")

def get_places_within_radius(lng, lat, radius_km, service_types=None):
    if places_collection is None:
        return []
        
    query = {
        "location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "$maxDistance": radius_km * 1000  # meters
            }
        }
    }
    
    if service_types:
        query["type"] = {"$in": service_types}
        
    cursor = places_collection.find(query)
    places = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        # Add distance logic in controller or here if needed
        places.append(doc)
    return places

def upsert_places(places_data):
    if places_collection is None:
        return
        
    for place in places_data:
        place['cached_at'] = datetime.now(timezone.utc)
        places_collection.update_one(
            {"place_id": place["place_id"]},
            {"$set": place},
            upsert=True
        )
