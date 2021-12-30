import React from 'react';
import { generatorActionVisible, hasVisibleGeneratorAction } from '../../utils/activityCalculations';
import { ResourceEnumFromString, ResourceName, ResourceNameNotEnergy, UpgradeName } from '../../utils/definitions';
import { experienceForNextActivitiesLevel } from '../../utils/experience';
import { integerPart } from '../../utils/formatters';
import { Player } from '../../utils/player';
import { hasUpgrade } from '../../utils/upgradeCalculations';
import './Activities.css';
import { GenAction } from './GenAction';

type ActivitiesPropType = {
  player: Player,
  activateGenAction: (fr: ResourceNameNotEnergy) => void
  upgradeGenAction: (fr: ResourceNameNotEnergy) => void
  decreaseCurrentLevel: (fr: ResourceNameNotEnergy) => void
  increaseCurrentLevel: (fr: ResourceNameNotEnergy) => void
}

export const Activities = (props: ActivitiesPropType) => {
  if (!hasVisibleGeneratorAction(props.player)) {
    return null;
  }

  const hasMagnifierUpgrade = hasUpgrade(props.player, UpgradeName.MAGNIFYING_APP)

  return (
    <div className='gamepanel activitiescontainer'>
      <div className='activitiesheader'>Activities</div>
      <ActivitiesSummary
        level={props.player.activitiesLevel}
        totalExp={props.player.activitiesTotalExperience}
        hasMagnifier={hasMagnifierUpgrade}
      />
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
                    decreaseLevel={() => props.decreaseCurrentLevel(forresnameEnum)}
                    increaseLevel={() => props.increaseCurrentLevel(forresnameEnum)}
                    hasMagnifier={hasMagnifierUpgrade}
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
  totalExp: number,
  hasMagnifier: boolean
}

const ActivitiesSummary = (props: ActivitiesSummaryProptype) => {
  const expForNextLevel = experienceForNextActivitiesLevel(props.level);

  return (
    <div className='activitiessummary'>
      <div className='activitylevel'>{props.hasMagnifier ? 'Lvl:' + props.level : ''}</div>
      <div className='activityexperience'>{props.hasMagnifier ? 'Exp:' + integerPart(props.totalExp) + '/' + expForNextLevel : ''}</div>
    </div>
  );
}