from models.placeModel import get_db
import logging
from bson.objectid import ObjectId

def get_users_collection():
    db = get_db()
    if db is None:
        return None
    users_collection = db.users
    # Ensure index on email
    try:
        users_collection.create_index("email", unique=True)
    except Exception as e:
        logging.warning(f"Could not create index on users collection: {e}")
    return users_collection

def create_user(user_data):
    collection = get_users_collection()
    if collection is None:
        raise Exception("Database connection not established")
    
    # default empty array for distress emails
    if "distress_emails" not in user_data:
        user_data["distress_emails"] = []
        
    result = collection.insert_one(user_data)
    return str(result.inserted_id)

def find_user_by_email(email):
    collection = get_users_collection()
    if collection is None:
        return None
    return collection.find_one({"email": email})

def find_user_by_id(user_id):
    collection = get_users_collection()
    if collection is None:
        return None
    try:
        return collection.find_one({"_id": ObjectId(user_id)})
    except:
        return None

def update_user_distress_emails(user_id, emails_list):
    collection = get_users_collection()
    if collection is None:
        raise Exception("Database connection not established")
    
    collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"distress_emails": emails_list}}
    )
