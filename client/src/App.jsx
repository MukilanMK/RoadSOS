import React from 'react';
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
        <header className="app-header">
          <h1>ROADSoS</h1>
          <p>Instant Emergency Response on Indian Roads</p>
        </header>

        <EmergencyBanner />

        <SOSButton location={location} />

        {locError && (
          <div className="loading" style={{color: 'var(--primary)'}}>
            <p>{locError}</p>
            <button className="btn btn-call" style={{marginTop: '1rem', background: 'var(--bg-card)'}} onClick={requestLocation}>
              Retry Location
            </button>
          </div>
        )}

        {locLoading ? (
          <div className="loading">Acquiring GPS location...</div>
        ) : (
          location && (
            <>
              <MapView location={location} services={services} />
              <ServiceList 
                services={services} 
                loading={servicesLoading} 
                error={servicesError} 
              />
            </>
          )
        )}
      </div>
    </>
  );
}

export default App;
