import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-header">
        <div>
          <h3 className="service-name">{service.name}</h3>
          <span className="service-type">{service.type}</span>
        </div>
        <div className="service-distance">
          {service.distance_km.toFixed(1)} km
        </div>
      </div>
      <p className="service-address">{service.address}</p>
      
      <div className="service-actions">
        <a href={service.maps_uri} target="_blank" rel="noreferrer" className="btn btn-nav" style={{ gridColumn: '1 / -1' }}>
          🗺️ Navigate
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
