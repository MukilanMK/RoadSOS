import React, { useState } from 'react';
import useLocation from './hooks/useLocation';
import useNearbyServices from './hooks/useNearbyServices';
import OfflineBanner from './components/OfflineBanner';
import EmergencyBanner from './components/EmergencyBanner';
import SOSButton from './components/SOSButton';
import MapView from './components/MapView';
import ServiceList from './components/ServiceList';
import './index.css';

function App() {
  const { location, error: locError, loading: locLoading, requestLocation } = useLocation();
  const { services, loading: servicesLoading, error: servicesError } = useNearbyServices(location);

  return (
    <>
      <OfflineBanner />
      
      <div className="app-container">
        {/* Floating Header */}
        <div className="floating-header">
          <header className="app-header">
            <h1>ROADSoS</h1>
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
