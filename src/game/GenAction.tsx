import { activateGenAction, canActivateGenAction, canLevelGenAction, genActionEnergyUsage, genActionLevelupResourceName, genActionName, genActionNextLevelResourceNeeded, genActionResourceGenerated, hasEnoughEnergyToActivateGenAction, levelUpGenAction } from '../utils/activityCalculations'
import { ResourceNameNotEnergy } from '../utils/definitions'
import { experienceForNextMasteryLevel } from '../utils/experience'
import { integerPart, oneDecimal } from '../utils/formatters'
import { Player } from '../utils/player'
import './GenAction.css'

type GenActionPropType = {
  player: Player,
  forResourceName: ResourceNameNotEnergy
}

export const GenAction = (props: GenActionPropType) => {
  const canActivateClass = canActivateGenAction(props.player, props.forResourceName) ? 'clickable' : '';
  const genActionMastery = props.player.generatorActionMasteryLevels[props.forResourceName];
  let cooldownLeftTxt = '';
  if (genActionMastery.cooldownLeft > 0.01) {
    if (genActionMastery.cooldownLeft >= 1) {
      cooldownLeftTxt = integerPart(genActionMastery.cooldownLeft).toString()
    } else {
      cooldownLeftTxt = oneDecimal(genActionMastery.cooldownLeft)
    }
  }

  const level = genActionMastery.level;
  const name = genActionName(props.forResourceName, level)
  const energyUsed = genActionEnergyUsage(props.forResourceName, level);
  const hasEnoughEnergyClass = hasEnoughEnergyToActivateGenAction(props.player, props.forResourceName) ? '' : 'notenoughresource';

  const mastery = genActionMastery.mastery;
  const currentExp = genActionMastery.experience;
  const nextMasteryExp = experienceForNextMasteryLevel(mastery);

  const levelupResNameCostTxt = genActionLevelupResourceName(props.forResourceName) + ': ' + genActionNextLevelResourceNeeded(props.forResourceName, level)

  const tooltipTxt = '+' + integerPart(genActionResourceGenerated(props.player, props.forResourceName)) + ' ' + props.forResourceName;
 
  return (
    <div className={'genactionrow forthis ' + canActivateClass} onClick={() => activateGenAction(props.player, props.forResourceName)}>
      <div className='genactioncdn'>{cooldownLeftTxt}</div>
      <div className='genactiontextcontainer'>
        <div className='genactiontext'>{name}</div>
        <div className={'genactioncost ' + hasEnoughEnergyClass}>{'E : ' + oneDecimal(energyUsed)}</div>
      </div>
      <div className='genactionmasterycontainer'>
        <div className='genactionmastery'>Mastery: {mastery}, Exp: {oneDecimal(currentExp)} / {nextMasteryExp}</div>
        <div className='genactionlevel'>
          <span>Level: {level}</span>
          <button
            className='genactionlevelbtn'
            disabled={!canLevelGenAction(props.player, props.forResourceName)}
            onClick={(e) => {
              levelUpGenAction(props.player, props.forResourceName);
              e.stopPropagation();
            }}
          >{levelupResNameCostTxt}</button>
        </div>
      </div>
      <div className='showthat'>{tooltipTxt}</div>
    </div>
  )
}