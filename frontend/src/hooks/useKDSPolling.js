import { useEffect, useRef } from 'react';

export default function useKDSPolling(callback, interval = 5000, isEnabled = true) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isEnabled) return;
    
    function tick() {
      savedCallback.current();
    }
    
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, isEnabled]);
}
