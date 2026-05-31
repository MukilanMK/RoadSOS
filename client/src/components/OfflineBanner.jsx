import React from 'react';
import useOfflineStatus from '../hooks/useOfflineStatus';

const OfflineBanner = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="offline-banner">
      ⚠️ You are offline. Showing cached nearby services and emergency numbers.
    </div>
  );
};

export default OfflineBanner;
