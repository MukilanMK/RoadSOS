import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card glass-panel">
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
        {service.phone && service.phone !== "Available on Maps" ? (
          <a href={`tel:${service.phone}`} className="btn btn-call">
            📞 Call
          </a>
        ) : (
          <a href={service.maps_uri} target="_blank" rel="noreferrer" className="btn btn-call" style={{background: '#4b5563'}}>
            Info
          </a>
        )}
        <a href={service.maps_uri} target="_blank" rel="noreferrer" className="btn btn-nav">
          🗺️ Navigate
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
