import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    return loadFromStorage(key, defaultValue);
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    saveToStorage(key, newValue);
  };

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to parse localStorage value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setStoredValue];
};