import React from 'react';

const SOSButton = ({ location }) => {
  const handleSOS = async () => {
    if (!location) {
      alert("Location not detected yet. Please wait or ensure GPS is enabled.");
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/sos/trigger`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ lat: location.lat, lng: location.lng })
        });
      } catch (err) {
        console.error("Failed to trigger SOS emails", err);
      }
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
