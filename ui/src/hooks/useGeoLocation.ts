import { useState, useEffect } from 'react';

export const useGeoLocation = (value: string) => {
  const [countryCode, setCountryCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCountryCode = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        setCountryCode(data.address.country_code.toLowerCase());
      } catch (err) {
        setError('Error fetching country code');
      }
    };

    if (!value && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCountryCode(latitude, longitude);
        },
        (err) => {
          setError('Geolocation error: ' + err.message);
        }
      );
    }
  }, [value]);

  return { countryCode, error };
};
