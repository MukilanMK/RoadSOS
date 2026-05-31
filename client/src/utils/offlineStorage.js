import { openDB } from 'idb';

const DB_NAME = 'roadsos_db';
const DB_VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('services')) {
        db.createObjectStore('services', { keyPath: 'place_id' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    }
  });
};

export const saveServices = async (services) => {
  try {
    const db = await initDB();
    const tx = db.transaction('services', 'readwrite');
    for (const service of services) {
      tx.store.put(service);
    }
    await tx.done;
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
  }
};

export const getCachedServices = async () => {
  try {
    const db = await initDB();
    return await db.getAll('services');
  } catch (error) {
    console.error('Failed to get from IndexedDB:', error);
    return [];
  }
};

export const saveLastFetchMetadata = async (lat, lng, timestamp) => {
  try {
    const db = await initDB();
    await db.put('metadata', { key: 'last_fetch', lat, lng, timestamp });
  } catch (error) {
    console.error('Failed to save metadata to IndexedDB:', error);
  }
};

export const getLastFetchMetadata = async () => {
  try {
    const db = await initDB();
    return await db.get('metadata', 'last_fetch');
  } catch (error) {
    console.error('Failed to get metadata from IndexedDB:', error);
    return null;
  }
};
