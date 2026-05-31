import React from 'react';
import helplines from '../data/indianHelplines.json';

const EmergencyBanner = () => {
  const numbers = helplines.INDIA;

  return (
    <div className="emergency-banner glass-panel">
      {Object.entries(numbers).map(([key, number]) => (
        <a key={key} href={`tel:${number}`} className="emergency-item">
          <span className="name">{key.replace('_', ' ')}</span>
          <span className="number">{number}</span>
        </a>
      ))}
    </div>
  );
};

export default EmergencyBanner;
