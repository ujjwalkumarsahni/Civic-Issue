import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('आपका ब्राउज़र location support नहीं करता');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Location लेने में समस्या हुई';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission नहीं दी गई';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location उपलब्ध नहीं है';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location लेने का समय समाप्त हुआ';
            break;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, loading, error, getCurrentLocation };
};

export default useLocation;