import { useState, useCallback } from 'react';

export default function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      return { data: response, error: null };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'API Request failed';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
}
