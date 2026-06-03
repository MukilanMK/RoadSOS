import React from 'react';

const SOSButton = ({ location }) => {
  const handleSOS = () => {
    if (!location) {
      alert("Location not detected yet. Please wait or ensure GPS is enabled.");
      return;
    }

    const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    const message = `SOS! I need emergency assistance. My current location is: ${mapsLink}`;
    
    // Create sms link
    // On iOS, it uses &body=, on Android it uses ?body=
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const separator = isIOS ? '&' : '?';
    const smsLink = `sms:${separator}body=${encodeURIComponent(message)}`;
    
    window.location.href = smsLink;
  };

  return (
    <button className="sos-btn" onClick={handleSOS}>
      SOS
    </button>
  );
};

export default SOSButton;
