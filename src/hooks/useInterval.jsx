import { useEffect, useRef } from 'react';
import { T } from '../utils/utils';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      let id = T.setIntervalRoundSecond(savedCallback.current);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;