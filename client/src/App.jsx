import React, { useState } from 'react';
import useLocation from './hooks/useLocation';
import useNearbyServices from './hooks/useNearbyServices';
import OfflineBanner from './components/OfflineBanner';
import EmergencyBanner from './components/EmergencyBanner';
import SOSButton from './components/SOSButton';
import MapView from './components/MapView';
import ServiceList from './components/ServiceList';
import AuthModal from './components/AuthModal';
import AccountTab from './components/AccountTab';
import './index.css';

function App() {
  const { location, error: locError, loading: locLoading, requestLocation } = useLocation();
  const [radius, setRadius] = useState(25);
  const { services, loading: servicesLoading, error: servicesError } = useNearbyServices(location, radius);
  
  const [showAuth, setShowAuth] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd validate the token or fetch user info here
      setUser({ loggedIn: true });
    }
  }, []);

  const handleAccountClick = () => {
    if (user) {
      setShowAccount(true);
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <OfflineBanner />
      
      {/* Top Right Account Icon */}
      <button className="account-icon-btn floating-account-btn" onClick={handleAccountClick} title="Account">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }} 
        />
      )}
      
      {showAccount && (
        <AccountTab 
          onClose={() => setShowAccount(false)} 
          onLogout={() => {
            setUser(null);
            setShowAccount(false);
          }}
          radius={radius}
          setRadius={setRadius}
        />
      )}

      <div className="app-container">
        {/* Floating Header */}
        <div className="floating-header">
          <header className="app-header">
            <h1 style={{ margin: 0 }}>ROADSoS</h1>
          </header>
          <EmergencyBanner />
        </div>

        {/* Map Background Layer */}
        {locLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Acquiring exact location...</p>
          </div>
        ) : locError ? (
          <div className="error-state">
            <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{locError}</p>
            <button className="btn btn-nav" onClick={requestLocation}>
              Retry GPS
            </button>
          </div>
        ) : (
          location && (
            <>
              <div className="map-wrapper">
                <MapView location={location} services={services} />
              </div>

              {/* Bottom Sheet Layer */}
              <div className="bottom-sheet">
                <div className="sos-trigger-container">
                  <SOSButton location={location} />
                </div>
                
                <div className="sheet-header">
                  <h2 className="sheet-title">Nearby Assistance</h2>
                </div>
                
                <div className="sheet-content">
                  <ServiceList 
                    services={services} 
                    loading={servicesLoading} 
                    error={servicesError} 
                  />
                </div>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
}

export default App;
