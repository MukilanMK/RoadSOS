# ROADSoS

**ROADSoS - Instant Emergency Response on Indian Roads**

ROADSoS is a web application designed to provide immediate assistance and locate nearby emergency services (such as hospitals, mechanics, police stations, etc.) when you are on the road. The application uses your device's GPS to find your location and displays vital services on an interactive map. It also features offline capabilities so it can be reliable even in areas with poor network connectivity.

## Features

- **Real-time GPS Location**: Acquires the user's current coordinates.
- **Interactive Map**: Displays the user's location and nearby emergency services using Leaflet.
- **Emergency Services List**: Lists nearby services like hospitals, towing, mechanics, and police.
- **SOS Button**: Quick access to trigger an emergency alert.
- **Offline Mode (PWA)**: Built with Workbox to provide offline caching and support when the network drops.
- **RESTful API**: Flask backend to query and fetch nearby places using MongoDB.

## Tech Stack

### Frontend (Client)
- React 19
- Vite
- React-Leaflet (Maps integration)
- Axios (API requests)
- Workbox (PWA Service Workers)
- IndexedDB (Offline storage)

### Backend (Server)
- Python 3.x
- Flask
- Flask-CORS
- PyMongo (MongoDB Integration)
- python-dotenv

## Project Structure

```text
Roadsos/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # React components, hooks, and views
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
└── server/                 # Flask backend API
    ├── controllers/        # Business logic for routes
    ├── models/             # Database initialization (MongoDB)
    ├── routes/             # API route definitions
    ├── app.py              # Flask app entry point
    ├── config.py           # Configuration variables
    └── requirements.txt    # Python dependencies
```

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB instance (local or Atlas)

### Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `MONGO_URI` and any other configurations.
5. Run the Flask development server:
   ```bash
   python app.py
   ```
   *The server will run on `http://localhost:5000`.*

### Frontend Setup (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will typically run on `http://localhost:5173`.*

## API Endpoints

- `GET /health` - Health check endpoint.
- `GET /api/nearby?lat={latitude}&lng={longitude}&radius={radius}` - Fetches nearby emergency services based on coordinates.
