import React, { useState } from 'react';
import ServiceCard from './ServiceCard';

const FILTERS = ['all', 'hospital', 'police', 'ambulance', 'towing', 'puncture'];

const ServiceList = ({ services, loading, error }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredServices = services.filter(service => 
    activeFilter === 'all' || service.type === activeFilter
  );

  return (
    <>
      <div className="filters">
        {FILTERS.map(filter => (
          <button 
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="loading" style={{textAlign: 'center', padding: '2rem'}}>Fetching nearby services...</div>}
      
      {error && <div className="loading" style={{color: 'var(--primary)', textAlign: 'center', padding: '2rem'}}>{error}</div>}

      <div className="service-list">
        {!loading && filteredServices.length === 0 && !error ? (
          <div className="loading" style={{textAlign: 'center', padding: '2rem'}}>No services found nearby.</div>
        ) : (
          filteredServices.map(service => (
            <ServiceCard key={service.place_id} service={service} />
          ))
        )}
      </div>
    </>
  );
};

export default ServiceList;
