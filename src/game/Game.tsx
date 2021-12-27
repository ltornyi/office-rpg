import React, { useEffect, useRef, useState } from 'react';
import './Game.css';
import { GameHeader } from './GameHeader';
import { Resources } from './Resources';
import { Activities } from './Activities';
import { Skills } from './Skills';
import { Upgrades } from './Upgrades';
import { GameFooter } from './GameFooter';
import { useNavigate } from 'react-router-dom';

export type gamePropsType = {
  selectedSlot: number
}

const useAnimationFrame = (callback: Function, run: boolean) => {
  // from https://css-tricks.com/using-requestanimationframe-with-react-hooks/
  // also https://github.com/layonez/use-request-animation-frame/blob/main/src/index.tsx
  const requestRef = useRef(0);
  const previousTimeRef = useRef(Date.now());
  
  const animate = () => {
    const currentTime = Date.now();
    const deltaSeconds =  (currentTime - previousTimeRef.current) / 1000;
    callback(deltaSeconds);

    previousTimeRef.current = currentTime;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (run) {
      previousTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [run]); //we intentionally ignore the animate dependency to make sure this effect runs only once
}

export const Game = (props: gamePropsType) => {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [run, setRun] = useState(false);

  useAnimationFrame( (deltaSeconds: number) => {
    setElapsedSeconds(prev => prev + deltaSeconds)
  }, run);

  return (
    <div className='gamecontainer'>
      <GameHeader >
        <p>Game works, selected slot is {props.selectedSlot}, elapsedSeconds is {Math.floor(elapsedSeconds * 10) / 10}</p>
        <button onClick={() => {
          setElapsedSeconds(0);
          setRun(true);
        }}>Start</button>
        <button onClick={() => setRun(false)}>Stop</button>
        <button onClick={() => navigate('/')}>Goto main menu</button>
      </GameHeader>
      <Resources />
      <Activities />
      <Skills />
      <Upgrades />
      <GameFooter />
    </div>
  )
}
