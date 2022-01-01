import { canActivateGenAction, canDecreaseCurrentLevel, canIncreaseCurrentLevel, canUpgradeGenAction, genActionCooldownTime, genActionEnergyUsage, genActionLevelupResourceName, genActionName, genActionNextLevelResourceNeeded,
  genActionResourceGenerated, hasEnoughEnergyToActivateGenAction } from '../../utils/activityCalculations'
import { ResourceName, ResourceNameNotEnergy } from '../../utils/definitions'
import { experienceForNextMasteryLevel } from '../../utils/experience'
import { integerPart, oneDecimal, resourceCost } from '../../utils/formatters'
import { Player } from '../../utils/player'
import './GenAction.css'

type GenActionPropType = {
  player: Player,
  forResourceName: ResourceNameNotEnergy,
  activate: () => void,
  upgrade: () => void,
  decreaseLevel: () => void,
  increaseLevel: () => void,
  hasMagnifier: boolean
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

  const canDecreaseLevel = canDecreaseCurrentLevel(props.player, props.forResourceName);
  const canIncreaseLevel = canIncreaseCurrentLevel(props.player, props.forResourceName);
 
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
        <div className={'genactioncost ' + hasEnoughEnergyClass}>{resourceCost(ResourceName.ENERGY, energyUsed)}</div>
      </div>
      
      {
        props.hasMagnifier &&
        <GenActionLevel
          canDecreaseLevel={canDecreaseLevel}
          canIncreaseLevel={canIncreaseLevel}
          decreaseLevel={props.decreaseLevel}
          increaseLevel={props.increaseLevel}
          currentLevel={currentLevel}
        />
      }

      { props.hasMagnifier &&
        <GenActionUpgrade
          canUpgrade={canUpgrade}
          upgrade={props.upgrade}
        />
      }

      <div className='showthat'>
        <div>{'Gain +' + oneDecimal(genActionResourceGenerated(props.player, props.forResourceName)) + ' ' + props.forResourceName}</div>
        <div>{oneDecimal(genActionCooldownTime(props.player, props.forResourceName))}s cooldown</div>
        {
          props.hasMagnifier &&
          <>
          <div className='separator'></div>
          <div>Mastery: {mastery}</div>
          <div>Exp: {oneDecimal(currentExp)} / {nextMasteryExp}</div>
          <div className='separator'></div>
          <div>Upgrade</div>
          <div>{levelupResNameCostTxt}</div>
          </>
        }
      </div>
    </div>
  )
}

type GenActionLevelPropType = {
  canDecreaseLevel: boolean,
  canIncreaseLevel: boolean,
  decreaseLevel: () => void,
  increaseLevel: () => void,
  currentLevel: number,
}

const GenActionLevel = (props: GenActionLevelPropType) => {

  return (
    <div className='genactionmasterycontainer'>
      <div className='genactionlevel'>
        <button
          className='genactionlevelbtn btn-small btn-secondary'
          disabled={!props.canIncreaseLevel}
          onClick={(e) => {
            e.stopPropagation();
            if (props.canIncreaseLevel) {
              props.increaseLevel();
            }
          }}
          >&uarr;
        </button>
        <span>Lvl {props.currentLevel}</span>
        <button
          className='genactionlevelbtn btn-small btn-secondary'
          disabled={!props.canDecreaseLevel}
          onClick={(e) => {
            e.stopPropagation();
            if (props.canDecreaseLevel) {
              props.decreaseLevel();
            }
          }}
        >&darr;
        </button>
      </div>
    </div>
  )
}

type GenActionUpgradePropType = {
  canUpgrade: boolean,
  upgrade: () => void
}

const GenActionUpgrade = (props: GenActionUpgradePropType) => {
  return (
    <div className='genactionupgrade'>
      <button
        className='genactionlevelbtn btn btn-primary'
        disabled={!props.canUpgrade}
        onClick={(e) => {
          e.stopPropagation();
          if (props.canUpgrade) {
            props.upgrade();
          }
        }}
      >Upgr.
      </button>
    </div>
  )
}