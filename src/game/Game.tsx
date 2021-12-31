import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Game.css';
import { GameHeader } from './GameHeader';
import { Resources } from './resources/Resources';
import { Activities } from './activities/Activities';
import { Skills } from './skills/Skills';
import { Upgrades } from './upgrades/Upgrades';
import { loadSaveSlot, savePlayerToSlot} from '../utils/saveload';
import { useAnimationFrame } from './useAnimationFrame';
import { ResourceNameNotEnergy, SkillName, UpgradeName } from '../utils/definitions';
import { activateGenAction, buyUpgrade, decreaseGenActionCurrentLevel, generateNewPlayerState, increaseGenActionCurrentLevel, levelUpSkill, upgradeGenAction } from './gamefunctions';

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

  const skillLevelup = (sk: SkillName) => {
    const newPlayer = levelUpSkill(player, sk);
    setPlayer(newPlayer);
  }

  const activateThisGenAction = (forResName: ResourceNameNotEnergy) => {
    const newPlayer = activateGenAction(player, forResName);
    setPlayer(newPlayer);
  }

  const upgradeThisGenAction = (forResName: ResourceNameNotEnergy) => {
    const newPlayer = upgradeGenAction(player, forResName);
    setPlayer(newPlayer);
  }

  const decreaseGenActionLevel = (forResName: ResourceNameNotEnergy) => {
    const newPlayer = decreaseGenActionCurrentLevel(player, forResName);
    setPlayer(newPlayer);
  }

  const increaseGenActionLevel = (forResName: ResourceNameNotEnergy) => {
    const newPlayer = increaseGenActionCurrentLevel(player, forResName);
    setPlayer(newPlayer);
  }

  const buyThisUpgrade = (upgradeName: UpgradeName) => {
    const newPlayer = buyUpgrade(player, upgradeName);
    setPlayer(newPlayer);
  }

  return (
    <div className='gamecontainer'>
      <GameHeader >
        <p>Selected slot is {props.selectedSlot}, currentTimestamp: {new Date(currentTimestamp).toLocaleString()}</p>
        <button onClick={() => savePlayerToSlot(player, props.selectedSlot)}>Save</button>
        <button onClick={() => navigate('/')}>Goto main menu</button>
      </GameHeader>
      <Resources player={player}/>
      <Activities
        player={player}
        activateGenAction={activateThisGenAction}
        upgradeGenAction={upgradeThisGenAction}
        decreaseCurrentLevel={decreaseGenActionLevel}
        increaseCurrentLevel={increaseGenActionLevel}
      />
      <Skills player={player} skillLevelup={skillLevelup}/>
      <Upgrades player={player} buy={buyThisUpgrade}/>
    </div>
  )
}
