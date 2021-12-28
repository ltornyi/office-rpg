import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Game.css';
import { GameHeader } from './GameHeader';
import { Resources } from './Resources';
import { Activities } from './Activities';
import { Skills } from './Skills';
import { Upgrades } from './Upgrades';
import { GameFooter } from './GameFooter';
import { useNavigate } from 'react-router-dom';
import { loadSaveSlot, SavedGame } from '../utils/saveload';
import { processResourcesElapsedTime } from '../utils/resourceCalculations';
import { useAnimationFrame } from './useAnimationFrame';

export type gamePropsType = {
  selectedSlot: number
}

const generateNewPlayerState = (player: SavedGame, elapsedSeconds: number) => {
  const newPlayer = JSON.parse(JSON.stringify(player)) as SavedGame;

  processResourcesElapsedTime(newPlayer.resources, elapsedSeconds);
  
  newPlayer.lastUpdateTimeStamp = Date.now();
  return newPlayer;
}

export const Game = (props: gamePropsType) => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(loadSaveSlot(props.selectedSlot))
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (! [0,1,2].includes(props.selectedSlot)) {
      navigate('/');
    }
  });

  //we can't reference player, elapsedSeconds etc inside this hook
  //because the function we created here closes over it (the value won't change) 
  useAnimationFrame( (currentTime: number, elapsed: number) => {
    setElapsedSeconds(prev => prev + elapsed);
    setPlayer(prev => generateNewPlayerState(prev, elapsed))
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
      <Resources resources={player.resources}/>
      <Activities />
      <Skills />
      <Upgrades />
      <GameFooter />
    </div>
  )
}
