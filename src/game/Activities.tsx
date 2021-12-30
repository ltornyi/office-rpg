import React from 'react';
import { generatorActionVisible, hasVisibleGeneratorAction } from '../utils/activityCalculations';
import { ResourceEnumFromString, ResourceName, ResourceNameNotEnergy } from '../utils/definitions';
import { experienceForNextActivitiesLevel } from '../utils/experience';
import { integerPart } from '../utils/formatters';
import { Player } from '../utils/player';
import './Activities.css';
import { GenAction } from './GenAction';

type ActivitiesPropType = {
  player: Player,
  activateGenAction: (fr: ResourceNameNotEnergy) => void
  upgradeGenAction: (fr: ResourceNameNotEnergy) => void
}

export const Activities = (props: ActivitiesPropType) => {
  if (!hasVisibleGeneratorAction(props.player)) {
    return null;
  }

  return (
    <div className='gamepanel activitiescontainer'>
      <div className='activitiesheader'>Activities</div>
      <ActivitiesSummary level={props.player.activitiesLevel} totalExp={props.player.activitiesTotalExperience}/>
      <div className='genactionscontainer'>
        {Object.keys(props.player.generatorActionMasteryLevels).map(forresname => {
          const forresnameEnum = ResourceEnumFromString(forresname);
          //second condition is to make typescript happy (energy prop does not exist on generatorActionMasteryLevels)
          if (forresnameEnum  && forresnameEnum !== ResourceName.ENERGY && generatorActionVisible(props.player, forresnameEnum))
            return <GenAction
                    key={forresname}
                    player={props.player}
                    forResourceName={forresnameEnum}
                    activate={() => props.activateGenAction(forresnameEnum)}
                    upgrade={() => props.upgradeGenAction(forresnameEnum)}
                    />
          else
            return null;
        })}
      </div>
    </div>
  )
}

type ActivitiesSummaryProptype = {
  level: number,
  totalExp: number
}

const ActivitiesSummary = (props: ActivitiesSummaryProptype) => {
  const expForNextLevel = experienceForNextActivitiesLevel(props.level);

  return (
    <div className='activitiessummary'>
      <div className='activitylevel'>Lvl: {props.level}</div>
      <div className='activityexperience'>Exp: {integerPart(props.totalExp)} / {expForNextLevel}</div>
    </div>
  );
}