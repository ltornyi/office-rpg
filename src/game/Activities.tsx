import React from 'react';
import { hasVisibleGeneratorAction } from '../utils/activityCalculations';
import { experienceForNextActivitiesLevel } from '../utils/experience';
import { integerPart } from '../utils/formatters';
import { Player } from '../utils/player';
import './Activities.css';

type ActivitiesPropType = {
  player: Player
}

export const Activities = (props: ActivitiesPropType) => {
  if (!hasVisibleGeneratorAction(props.player)) {
    return null;
  }

  const expForNextLevel = experienceForNextActivitiesLevel(props.player.activitiesLevel);

  return (
    <div className='gamepanel activitiescontainer'>
      <div className='activitiesheader'>Activities</div>
      <div className='activitiessummary'>
          <div className='activitylevel'>Lvl: {props.player.activitiesLevel}</div>
          <div className='activityexperience'>Exp: {integerPart(props.player.activitiesTotalExperience)} / {expForNextLevel}</div>
      </div>
    </div>
  )
}
