# 🚨 ROADSoS - Emergency Response Platform for Indian Roads

**A location-based emergency response web application designed to save lives on Indian roads and highways.**





## 🎯 Problem Statement

Road accidents are among the most time-critical emergencies in India. When an accident occurs, **every second counts**.

### Key Challenges

- **Golden Hour**: The critical window following a traumatic injury when prompt treatment can prevent death or serious injury
- **Fragmented Solutions**: No unified platform for emergency and roadside assistance
- **Manual Search**: People manually search Google Maps under stress
- **Poor Network**: Rural areas and highways have limited connectivity
- **Multiple Contacts Needed**: Hospitals, police, ambulances, towing services, puncture shops spread across different apps
- **Communication Barriers**: Victims unable to speak or make calls need automated SOS solutions

### Pain Points

- ❌ No single platform for all road emergency services
- ❌ Google Maps search requires presence of mind during panic
- ❌ Poor/no network in rural areas and highways
- ❌ Bystanders willing to help but don't know who to call
- ❌ Towing & puncture shops ignored by existing apps
- ❌ Victims unable to make calls—need automated SMS solution

---

## 💡 Proposed Solution

**ROADSoS** is a location-aware, offline-first web application that instantly surfaces:

- 🏥 Trauma centres & hospitals
- 👮 Police stations
- 🚑 Ambulance services
- 🚗 Towing services
- 🔧 Puncture shops & repairs
- 📱 National emergency contacts (112, 108, 100, etc.)

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Speed** | One-tap interface for panic situations. Everything nearby sorted by distance with direct call buttons. |
| **Instant Communication** | SOS SMS feature with live GPS coordinates—works via 2G/cellular without data internet. |
| **Reliability** | Smart geo-caching reduces API calls and ensures consistent performance. Data for one user is reused for subsequent users within 5km radius. |
| **Offline-First** | PWA service workers + IndexedDB cache all nearby data. Pan-India emergency numbers hardcoded and always available. |

---

## 🔄 How It Works

```
┌─────────────────────────────────────┐
│  User Opens ROADSoS                 │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  GPS Detects Current Location       │
│  (Latitude, Longitude)              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Check Network Status               │
│  (navigator.onLine)                 │
└────────────┬────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
  ONLINE           OFFLINE
     │                │
     ▼                ▼
┌──────────────┐  ┌──────────────────┐
│ Query Flask  │  │ Serve from       │
│ API          │  │ IndexedDB Cache  │
└──────┬───────┘  └──────┬───────────┘
       │                 │
       ▼                 ▼
┌──────────────────────────────────┐
│ MongoDB: Data within 5km?        │
│ YES → Serve from DB              │
│ NO → Call Google Places API      │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Store in MongoDB (Upsert)        │
│ Save to IndexedDB (Backup)       │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Display Sorted Services:         │
│ • Distance                       │
│ • Name, Address, Phone           │
│ • Call Button                    │
│ • Navigate Button                │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ User Presses SOS Button          │
│ ↓                                │
│ Native SMS App Opens             │
│ ↓                                │
│ Pre-filled: Location Link        │
│ ↓                                │
│ Send via 2G/Cellular             │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ User Moves 5km                   │
│ ↓                                │
│ Re-fetch Triggered Automatically │
└──────────────────────────────────┘
```

---

## ✨ Features

### Core Features

#### 1️⃣ **Location Detection & SOS SMS Integration**
- Auto GPS detection on app open
- Manual location entry as fallback
- **One-tap SOS Button**: Generates pre-filled SMS with live Google Maps location link
- Uses `sms:` URI scheme to trigger native messaging app
- Works via standard cellular networks—no internet data required

#### 2️⃣ **Nearby Services Display**
Fetches and displays (sorted by distance):
- 🏥 Hospitals / Trauma Centres
- 👮 Police Stations
- 🚑 Ambulance Services
- 🚗 Towing Services
- 🔧 Puncture Shops / Car Repair
- 🏪 Vehicle Showrooms

**Each card displays:**
- Name & Address
- Distance (in km)
- Phone number (one-tap call)
- Google Maps navigation link

#### 3️⃣ **Smart Geo-Cache System**
- **First request** → Google Places API called → data stored in MongoDB
- **Subsequent requests** (within 5km radius) → served from MongoDB directly
- **Duplicate prevention** via upsert on Google's unique place_id
- **24-hour cache expiry** → auto re-fetches fresh data

#### 4️⃣ **Offline Mode**
- Service Worker caches app shell (HTML, CSS, JS) on first load
- IndexedDB stores last fetched nearby places per service type
- Offline banner shown when serving cached data
- Pan-India emergency numbers (112, 108, 100, etc.) always available

#### 5️⃣ **Auto Re-fetch on Movement**
- Haversine formula tracks user movement on frontend
- When user moves >5km from last fetch point → new request triggered
- Ensures data stays relevant across city/state travel

### Innovation Features

#### 🆘 **Pan-India Emergency Numbers Database**
```json
{
  "INDIA": { 
    "national_emergency": "112", 
    "police": "100", 
    "ambulance": "108", 
    "fire": "101",
    "women_helpline": "1091",
    "highway_rescue": "1033"
  }
}
```
- Static JSON with India-specific emergency numbers
- No API call needed—instant load, works offline
- Always visible at top of screen

#### 📋 **Accident Report Form**
- Quick form: location, time, number of vehicles, injuries
- Stored locally
- Easy copy/share via SMS/WhatsApp to traffic authorities

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js (PWA)** | UI framework, offline support via service workers |
| **Leaflet.js + OSM** | Free map rendering, no billing required |
| **IndexedDB** | Browser-side storage for offline caching |
| **Workbox** | Service worker management, cache strategies |
| **Axios** | HTTP requests to Flask backend |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python + Flask** | REST API server |
| **PyMongo** | MongoDB connection and queries |
| **Requests** | Google Places API calls |
| **Flask-CORS** | Allow React frontend to talk to Flask |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB** | Primary database with geospatial indexing |
| **2dsphere Index** | Fast "within X km" geo queries |
| **Upsert Strategy** | Prevent duplicate place entries |

### External APIs
| API | Purpose |
|-----|---------|
| **Google Places Nearby** | Fetch nearby hospitals, police, towing, etc. |
| **Google Place Details** | Fetch phone number per place |
| **Google Geocoding** | Convert lat/lng to Indian street/city address |

---

## 🏗 Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              User Browser (React PWA)                │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Service Worker (Workbox)                    │  │
│  │  • Cache app shell                           │  │
│  │  • Network/Cache strategy                    │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  IndexedDB Storage                           │  │
│  │  • Cached places per service type            │  │
│  │  • Last fetch timestamp                      │  │
│  │  • User location history                     │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  React Components                            │  │
│  │  • MapView (Leaflet)                         │  │
│  │  • ServiceCard                               │  │
│  │  • SOSButton (SMS Sender)                    │  │
│  │  • EmergencyBanner                           │  │
│  └──────────────────────────────────────────────┘  │
└───────────────────┬───────────────────────────────┘
                    │
                    │ Axios HTTP Requests
                    │ (with cache checks)
                    │
┌───────────────────▼───────────────────────────────┐
│           Flask Backend (Python)                   │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  Routes: /api/nearby                     │    │
│  │  GET /api/nearby?lat=X&lng=Y&radius=5km │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  PlacesController                        │    │
│  │  • Check MongoDB for cached data         │    │
│  │  • Call Google Places if needed          │    │
│  │  • Upsert results to MongoDB             │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  PlaceModel (PyMongo)                    │    │
│  │  • Upsert logic (unique place_id)        │    │
│  │  • Geo-query (2dsphere index)            │    │
│  └──────────────────────────────────────────┘    │
└───────────────────┬───────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌────────────┐ ┌──────────────┐
    │MongoDB │ │Google      │ │Google Places │
    │Database│ │Geocoding   │ │API           │
    └────────┘ └────────────┘ └──────────────┘
```

---

## 🗄 Database Design

### Collection: `places`

```javascript
{
  place_id: String,        // Google unique ID (indexed, unique)
  name: String,            // Place name
  type: String,            // hospital | police | towing | ambulance | puncture | showroom
  address: String,         // Formatted address
  phone: String,           // Contact number
  maps_uri: String,        // Direct maps link
  location: {              // GeoJSON point
    type: "Point",
    coordinates: [lng, lat]
  },
  cached_at: DateTime,     // When data was stored
  search_radius_km: Number // Radius used during fetch
}
```

### Indexes
```javascript
// Geospatial index for distance queries
db.places.createIndex({ "location": "2dsphere" })

// Unique index to prevent duplicates
db.places.createIndex({ "place_id": 1 }, { unique: true })
```

---

## 📁 Project Structure

```
roadsos/
├── client/                           ← React PWA Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json             ← PWA manifest
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ServiceCard.jsx       ← Individual place result card
│   │   │   ├── MapView.jsx           ← Leaflet map integration
│   │   │   ├── SOSButton.jsx         ← Core SOS SMS trigger (CRITICAL)
│   │   │   ├── EmergencyBanner.jsx   ← Indian emergency numbers (112, 108, etc.)
│   │   │   ├── ServiceList.jsx       ← Display all nearby services
│   │   │   ├── LocationInput.jsx     ← Manual location fallback
│   │   │   └── OfflineBanner.jsx     ← Offline mode indicator
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLocation.js        ← GPS + movement tracking with Haversine
│   │   │   ├── useNearbyServices.js  ← Fetch + cache logic
│   │   │   └── useOfflineStatus.js   ← Network status listener
│   │   │
│   │   ├── utils/
│   │   │   ├── offlineStorage.js     ← IndexedDB read/write operations
│   │   │   ├── haversine.js          ← Distance calculation formula
│   │   │   ├── axiosInstance.js      ← Axios config with cache headers
│   │   │   └── constants.js          ← App constants, radius limits
│   │   │
│   │   ├── data/
│   │   │   └── indianHelplines.json  ← Static India emergency numbers
│   │   │
│   │   ├── service-worker.js         ← Service worker (Workbox setup)
│   │   ├── App.jsx                   ← Main component
│   │   ├── App.css
│   │   └── index.js                  ← React entry point
│   │
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── server/                           ← Flask Backend
│   ├── app.py                        ← Main Flask application entry point
│   │
│   ├── routes/
│   │   └── places.py                 ← /api/nearby endpoint definition
│   │
│   ├── controllers/
│   │   └── placesController.py       ← Cache check + fetch logic
│   │
│   ├── models/
│   │   └── placeModel.py             ← MongoDB schema + upsert operations
│   │
│   ├── utils/
│   │   ├── googlePlaces.py           ← Google Places API wrapper
│   │   ├── geocoding.py              ← Address conversion logic
│   │   └── validators.py             ← Input validation
│   │
│   ├── config.py                     ← Environment variables, DB connection
│   ├── requirements.txt              ← Python dependencies
│   ├── .env.example
│   └── .gitignore
│
├── .env                              ← Environment variables (DO NOT COMMIT)
├── .gitignore
├── README.md                         ← This file
└── CONTRIBUTING.md
```

---

## 🚀 Setup & Installation Guide

### Prerequisites

Before you begin, ensure you have:

- **Node.js** v16+ and npm
- **Python** 3.8+
- **MongoDB** (local or cloud—MongoDB Atlas)
- **Google Cloud API Keys** (Places, Geocoding)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/roadsos.git
cd roadsos
```

### Step 2: Backend Setup (Flask + MongoDB)

#### 2a. Create Virtual Environment

```bash
cd server
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 2b. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt should contain:**
```
Flask==2.3.0
Flask-CORS==4.0.0
pymongo==4.5.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
```

#### 2c. Create .env File

```bash
cp .env.example .env
```

**Edit .env:**
```
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=app.py

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/roadsos?retryWrites=true&w=majority
# For local MongoDB: mongodb://localhost:27017/roadsos

# Google API Keys
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key_here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5000

# Search Configuration
DEFAULT_SEARCH_RADIUS_KM=5
CACHE_EXPIRY_HOURS=24
```

#### 2d. Verify MongoDB Connection

```bash
# Test local MongoDB
mongod

# Or test MongoDB Atlas connection in Python:
python -c "from pymongo import MongoClient; print(MongoClient('mongodb+srv://...').server_info())"
```

#### 2e. Run Flask Server

```bash
python app.py
```

**Expected output:**
```
* Running on http://127.0.0.1:5000
* WARNING in app.run(...) use production WSGI server
```

### Step 3: Frontend Setup (React PWA)

#### 3a. Install Dependencies

```bash
cd client
npm install
```

#### 3b. Create .env File

```bash
cp .env.example .env
```

**Edit .env:**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_DEFAULT_SEARCH_RADIUS=5
REACT_APP_MAX_CACHE_DISTANCE=5
```

#### 3c. Start Development Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view roadsos in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Verify Installation

1. Open browser → `http://localhost:3000`
2. Grant location permission
3. Verify nearby services appear
4. Test SOS button → native SMS app should open
5. Toggle offline (DevTools → Network → Offline) → cached data should still appear

---

## 💻 Development Workflow

### Daily Development Flow

```bash
# Terminal 1: Backend
cd server
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py

# Terminal 2: Frontend
cd client
npm start

# Terminal 3: MongoDB (if local)
mongod
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/sos-sms-improvements

# Make changes, commit
git add .
git commit -m "feat: improve SOS SMS pre-fill logic"

# Push and create PR
git push origin feature/sos-sms-improvements
```

### Code Quality Standards

```bash
# Frontend
npm run lint      # ESLint
npm run format    # Prettier

# Backend
pylint server/
black server/
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Get Nearby Services

**Endpoint:**
```
GET /api/nearby?lat=28.6139&lng=77.2090&radius=5&service_types=hospital,police,ambulance,towing,puncture
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | Float | ✅ Yes | Latitude |
| `lng` | Float | ✅ Yes | Longitude |
| `radius` | Integer | ❌ No | Search radius in km (default: 5) |
| `service_types` | String | ❌ No | Comma-separated service types |

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "place_id": "ChIJ4_R5yw0ExDkRJH08I2HZj3w",
      "name": "Apollo Hospital",
      "type": "hospital",
      "address": "Saket, New Delhi",
      "phone": "+91-11-4158-1111",
      "maps_uri": "https://maps.google.com/?q=28.5244,77.1855",
      "distance_km": 2.3,
      "cached": false
    },
    {
      "place_id": "ChIJ7_R5yw0ExDkRJH08I2HZj3w",
      "name": "New Delhi Police Station",
      "type": "police",
      "address": "Saket, New Delhi",
      "phone": "011-4141-3456",
      "maps_uri": "https://maps.google.com/?q=28.5245,77.1856",
      "distance_km": 3.1,
      "cached": true
    }
  ],
  "cached_from": "2024-01-15T10:30:00Z",
  "search_info": {
    "lat": 28.6139,
    "lng": 77.2090,
    "radius_km": 5,
    "services_found": 2
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Invalid latitude/longitude provided",
  "code": "INVALID_COORDINATES"
}
```

---



---

## 🌐 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel
```

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create roadsos-api

# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set GOOGLE_PLACES_API_KEY=...

# Deploy
git push heroku main
```

### Database Deployment (MongoDB Atlas)

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with password
3. Whitelist your IP address
4. Copy connection string
5. Update `MONGO_URI` in `.env`

### Geospatial Index Setup

```bash
# Connect to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net/roadsos"

# Create 2dsphere index
db.places.createIndex({ "location": "2dsphere" })

# Verify index
db.places.getIndexes()
```

---

## 📊 Monitoring & Analytics

### Metrics to Track

- **API Response Time**: Should be <500ms
- **Cache Hit Rate**: Target >60% after 1st hour
- **SOS Button Usage**: Track activations per location
- **Error Rate**: Google Places API failures
- **User Retention**: Return visit rates

---
