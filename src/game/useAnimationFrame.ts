import { useLayoutEffect, useRef } from 'react';

type animationCallback = (time: number, elapsed: number) => void;

export const useAnimationFrame = (callback: animationCallback, run: boolean) => {
  // from https://css-tricks.com/using-requestanimationframe-with-react-hooks/
  // also https://github.com/layonez/use-request-animation-frame/blob/main/src/index.tsx
  // explanation why useLayoutEffect fixes the problem https://blog.jakuba.net/request-animation-frame-and-use-effect-vs-use-layout-effect/
  const requestRef = useRef(0);
  const previousTimeRef = useRef(Date.now());
  
  const animate = () => {
    const currentTime = Date.now();
    const deltaSeconds =  (currentTime - previousTimeRef.current) / 1000;
    callback(currentTime, deltaSeconds);

    previousTimeRef.current = currentTime;
    requestRef.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    if (run) {
      previousTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [run]); //eslint-disable-line react-hooks/exhaustive-deps
  //we intentionally ignore the animate dependency to make sure this effect runs only once
}