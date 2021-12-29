import React, { useEffect, useState } from 'react';
import './Game.css';
import { GameHeader } from './GameHeader';
import { Resources } from './Resources';
import { Activities } from './Activities';
import { Skills } from './Skills';
import { Upgrades } from './Upgrades';
import { useNavigate } from 'react-router-dom';
import { loadSaveSlot, savePlayerToSlot} from '../utils/saveload';
import { generateNewPlayerState } from '../utils/player';
import { useAnimationFrame } from './useAnimationFrame';

export type gamePropsType = {
  selectedSlot: number
}

export const Game = (props: gamePropsType) => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(loadSaveSlot(props.selectedSlot))
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [lastAutosaveAt, setLastAutosaveAt] = useState(Date.now());

  useEffect(() => {
    if (! [0,1,2].includes(props.selectedSlot)) {
      navigate('/');
    }
  });

  //Main game loop
  //we can't reference player, elapsedSeconds etc inside this hook
  //because the function we created here closes over it (the value won't change) 
  useAnimationFrame( (currentTime: number, elapsed: number) => {
    setCurrentTimestamp(currentTime);
    setPlayer(prevPlayer => generateNewPlayerState(prevPlayer, elapsed));
  }, true);

  //Autosave every 30 seconds:
  useEffect( () => {
    if (currentTimestamp - lastAutosaveAt > 30000) {
      savePlayerToSlot(player, props.selectedSlot);
      setLastAutosaveAt(Date.now());
    }
  }, [currentTimestamp, player, lastAutosaveAt, props.selectedSlot]);

  return (
    <div className='gamecontainer'>
      <GameHeader >
        <p>Selected slot is {props.selectedSlot}, currentTimestamp: {new Date(currentTimestamp).toLocaleString()}</p>
        <button onClick={() => savePlayerToSlot(player, props.selectedSlot)}>Save</button>
        <button onClick={() => navigate('/')}>Goto main menu</button>
      </GameHeader>
      <Resources resources={player.resources}/>
      <Activities player={player} />
      <Skills player={player}/>
      <Upgrades />
    </div>
  )
}
