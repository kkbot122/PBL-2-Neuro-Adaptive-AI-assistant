import { useEffect, useRef, useState } from "react";

export function useTrackVisibility(offset = 0.5) {
  const [isVisible, setIsVisible] = useState(false);
  const [secondsViewed, setSecondsViewed] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If at least 50% (offset) of the element is visible
        setIsVisible(entry.isIntersecting);
      },
      { threshold: offset }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [offset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible) {
      // Start the clock!
      interval = setInterval(() => {
        setSecondsViewed((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isVisible]);

  return { elementRef, secondsViewed, isVisible };
}