
import { useState, useEffect } from 'react';

// Custom hook to track online/offline status
const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handler when the user goes online
    const handleOnline = () => {
      setIsOnline(true);
    };

    // Handler when the user goes offline
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen for online and offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up the event listeners when the component is unmounted
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useIsOnline;
