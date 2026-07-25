import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { saveServices, getCachedServices, saveLastFetchMetadata, getLastFetchMetadata } from '../utils/offlineStorage';
import { calculateDistance } from '../utils/haversine';
import useOfflineStatus from './useOfflineStatus';

const CACHE_DISTANCE_THRESHOLD = import.meta.env.VITE_MAX_CACHE_DISTANCE || 5;

const useNearbyServices = (location, radius = 25) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isOffline = useOfflineStatus();

  const fetchServices = useCallback(async (forceFetch = false) => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      if (isOffline) {
        // Load from IndexedDB
        const cached = await getCachedServices();
        const sorted = cached.map(service => ({
          ...service,
          distance_km: calculateDistance(location.lat, location.lng, service.location.coordinates[1], service.location.coordinates[0])
        })).sort((a, b) => a.distance_km - b.distance_km);
        setServices(sorted);
        setLoading(false);
        return;
      }

      // Check if we need to fetch from API based on distance
      const lastFetch = await getLastFetchMetadata();
      let shouldFetch = forceFetch || !lastFetch;
      
      if (!shouldFetch && lastFetch) {
        const dist = calculateDistance(location.lat, location.lng, lastFetch.lat, lastFetch.lng);
        if (dist > CACHE_DISTANCE_THRESHOLD) {
          shouldFetch = true;
        }
      }

      if (shouldFetch) {
        const response = await axiosInstance.get('/nearby', {
          params: { lat: location.lat, lng: location.lng, radius: radius }
        });
        
        if (response.data.success) {
          setServices(response.data.data);
          await saveServices(response.data.data);
          await saveLastFetchMetadata(location.lat, location.lng, new Date().toISOString());
        } else {
          throw new Error(response.data.error || 'Failed to fetch services');
        }
      } else {
        // Load from cache and calculate new distances
        const cached = await getCachedServices();
        const sorted = cached.map(service => ({
          ...service,
          distance_km: calculateDistance(location.lat, location.lng, service.location.coordinates[1], service.location.coordinates[0])
        })).sort((a, b) => a.distance_km - b.distance_km);
        setServices(sorted);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
      
      // Fallback to cache on error
      const cached = await getCachedServices();
      if (cached.length > 0) {
        const sorted = cached.map(service => ({
          ...service,
          distance_km: calculateDistance(location.lat, location.lng, service.location.coordinates[1], service.location.coordinates[0])
        })).sort((a, b) => a.distance_km - b.distance_km);
        setServices(sorted);
        setError('Using cached offline data due to network error.');
      }
    } finally {
      setLoading(false);
    }
  }, [location, isOffline, radius]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices, radius]);

  return { services, loading, error, refetch: () => fetchServices(true) };
};

export default useNearbyServices;
