import { canActivateGenAction, canUpgradeGenAction, genActionEnergyUsage, genActionLevelupResourceName, genActionName, genActionNextLevelResourceNeeded,
  genActionResourceGenerated, hasEnoughEnergyToActivateGenAction } from '../utils/activityCalculations'
import { ResourceNameNotEnergy } from '../utils/definitions'
import { experienceForNextMasteryLevel } from '../utils/experience'
import { integerPart, oneDecimal } from '../utils/formatters'
import { Player } from '../utils/player'
import './GenAction.css'

type GenActionPropType = {
  player: Player,
  forResourceName: ResourceNameNotEnergy,
  activate: () => void,
  upgrade: () => void
}

export const GenAction = (props: GenActionPropType) => {
  const canActivate = canActivateGenAction(props.player, props.forResourceName);
  const genActionMastery = props.player.generatorActionMasteryLevels[props.forResourceName];
  let cooldownLeftTxt = '';
  if (genActionMastery.cooldownLeft > 0.01) {
    if (genActionMastery.cooldownLeft >= 1) {
      cooldownLeftTxt = integerPart(genActionMastery.cooldownLeft).toString()
    } else {
      cooldownLeftTxt = oneDecimal(genActionMastery.cooldownLeft)
    }
  }

  const currentLevel = genActionMastery.currentLevel;
  const name = genActionName(props.forResourceName, currentLevel)
  const energyUsed = genActionEnergyUsage(props.forResourceName, currentLevel);
  const hasEnoughEnergyClass = hasEnoughEnergyToActivateGenAction(props.player, props.forResourceName) ? '' : 'notenoughresource';

  const mastery = genActionMastery.mastery;
  const currentExp = genActionMastery.experience;
  const nextMasteryExp = experienceForNextMasteryLevel(mastery);

  const levelupResNameCostTxt = genActionLevelupResourceName(props.forResourceName) + ': ' + genActionNextLevelResourceNeeded(props.forResourceName, genActionMastery.maxLevel)
  const canUpgrade = canUpgradeGenAction(props.player, props.forResourceName);
 
  return (
    <div
      className={'genactionrow forthis ' + (canActivate ? 'clickable' : '')}
      onClick={() => {
        if (canActivate){
          props.activate()
        } 
      }}
    >
      <div className='genactioncdn'>{cooldownLeftTxt}</div>
      <div className='genactiontextcontainer'>
        <div className='genactiontext'>{name}</div>
        <div className={'genactioncost ' + hasEnoughEnergyClass}>{'E : ' + oneDecimal(energyUsed)}</div>
      </div>
      <div className='genactionmasterycontainer'>
        <div className='genactionlevel'>
          <button
            className='genactionlevelbtn btn-small btn-secondary'
            onClick={(e) => {
              e.stopPropagation();
            }}
            >&uarr;
          </button>
          <span>Lvl {currentLevel}</span>
          <button
            className='genactionlevelbtn btn-small btn-secondary'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >&darr;
          </button>
        </div>
      </div>
      <div className='genactionupgrade'>
        <button
          className='genactionlevelbtn btn btn-primary'
          disabled={!canUpgrade}
          onClick={(e) => {
            e.stopPropagation();
            if (canUpgrade) {
              props.upgrade();
            }
          }}
        >Upgr.
        </button>
      </div>
      <div className='showthat'>
        <div>{'Gain +' + oneDecimal(genActionResourceGenerated(props.player, props.forResourceName)) + ' ' + props.forResourceName}</div>
        <div className='separator'></div>
        <div>Mastery: {mastery}</div>
        <div>Exp: {oneDecimal(currentExp)} / {nextMasteryExp}</div>
        <div className='separator'></div>
        <div>Upgrade</div>
        <div>{levelupResNameCostTxt}</div>
      </div>
    </div>
  )
}