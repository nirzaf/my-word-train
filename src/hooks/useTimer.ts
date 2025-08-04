import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

export const useTimer = ({ initialTime, onTimeUp, autoStart = false }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Update the ref when onTimeUp changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onTimeUpRef.current();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsActive(false);
    setTimeLeft(newTime ?? initialTime);
  }, [initialTime]);

  const restart = useCallback((newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsActive(true);
  }, [initialTime]);

  return {
    timeLeft,
    isActive,
    start,
    pause,
    reset,
    restart,
  };
};