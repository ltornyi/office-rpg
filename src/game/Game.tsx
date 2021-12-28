import React, { useEffect, useState } from 'react';
import './Game.css';
import { GameHeader } from './GameHeader';
import { Resources } from './Resources';
import { Activities } from './Activities';
import { Skills } from './Skills';
import { Upgrades } from './Upgrades';
import { GameFooter } from './GameFooter';
import { useNavigate } from 'react-router-dom';
import { loadSaveSlot, savePlayerToSlot} from '../utils/saveload';
import { generateNewPlayerState } from '../utils/calculations';
import { useAnimationFrame } from './useAnimationFrame';

export type gamePropsType = {
  selectedSlot: number
}

export const Game = (props: gamePropsType) => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(loadSaveSlot(props.selectedSlot))
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [lastAutosaveAt, setLastAutosaveAt] = useState(Date.now());
  const [run, setRun] = useState(true);

  useEffect(() => {
    if (! [0,1,2].includes(props.selectedSlot)) {
      navigate('/');
    }
  });

  //we can't reference player, elapsedSeconds etc inside this hook
  //because the function we created here closes over it (the value won't change) 
  useAnimationFrame( (currentTime: number, elapsed: number) => {
    setCurrentTimestamp(currentTime);
    setPlayer(prevPlayer => generateNewPlayerState(prevPlayer, elapsed));
  }, run);

  useEffect( () => {
    if (currentTimestamp - lastAutosaveAt > 30000) {
      savePlayerToSlot(player, props.selectedSlot);
      setLastAutosaveAt(Date.now());
    }
  }, [currentTimestamp, player, lastAutosaveAt, props.selectedSlot]);

  return (
    <div className='gamecontainer'>
      <GameHeader >
        <p>Game works, selected slot is {props.selectedSlot}, currentTimestamp: {new Date(currentTimestamp).toLocaleString()}</p>
        <button onClick={() => {
          setCurrentTimestamp(Date.now());
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
