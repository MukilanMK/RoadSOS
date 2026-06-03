import React from 'react';
import helplines from '../data/indianHelplines.json';

const EmergencyBanner = () => {
  const numbers = helplines.INDIA;

  return (
    <div className="emergency-banner">
      {Object.entries(numbers).map(([key, number]) => (
        <div key={key} className="emergency-item">
          <div className="info">
            <span className="name">{key.replace('_', ' ')}</span>
            <span className="number">{number}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyBanner;
