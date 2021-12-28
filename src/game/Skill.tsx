import { SkillName } from '../utils/definitions';
import { oneDecimal } from '../utils/formatters';
import { Player } from '../utils/player';
import { CalcCanLevelup, calcLevelingCosts, canLevelUp, levelUpSkill, SkillCanLevelUpArr, SkillLevelingCosts } from '../utils/skillCalculations';
import './Skill.css';

type SkillPropType = {
  player: Player,
  skillName: SkillName
}

export const Skill = (props: SkillPropType) => {
  const skill = props.player.skills[props.skillName];
  const levelingCosts = calcLevelingCosts(props.skillName, skill.level);
  const canLevelArr = CalcCanLevelup(props.player, levelingCosts);
  const canLevel = canLevelUp(canLevelArr);
  return (
    <div
      className={'skillrow ' + (canLevel ? 'skill-upgradeable' : '')}
      onClick={() => levelUpSkill(props.player, props.skillName)}
    >
      <div className='skilllevel'>{skill.level}</div>
      <div className='skilltextcontainer'>
        <div className='skilltext'>{skill.name}</div>
        <SkillUpgradeCosts costs={levelingCosts} canLevelArr={canLevelArr}/>
      </div>
    </div>
  )
}

const SkillUpgradeCosts = (props: {costs: SkillLevelingCosts, canLevelArr: SkillCanLevelUpArr}) => {
  return (
    <div className='skillupgradecost'>
      {props.costs.map( c => {
        const canLevelItem = props.canLevelArr.find((item) => item.resourceName === c.resourceName);
        const canLevel = canLevelItem && canLevelItem.canLevel;
        const resText = c.resourceName.substring(0,1) + ' : ' + oneDecimal(c.cost)
        return <span className={canLevel ? '' : 'notenoughresource'}>{resText}</span>
      })}
    </div>
  );
}