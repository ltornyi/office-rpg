import { SkillDefinitions, SkillName } from '../../utils/definitions';
import { resourceCost } from '../../utils/formatters';
import { Player } from '../../utils/player';
import { CalcCanLevelup, calcLevelingCosts, canLevelUp, SkillCanLevelUpArr, SkillLevelingCosts } from '../../utils/skillCalculations';
import './Skill.css';

type SkillPropType = {
  player: Player,
  skillName: SkillName,
  skillLevelup: () => void
}

export const Skill = (props: SkillPropType) => {
  const skill = props.player.skills[props.skillName];
  const levelingCosts = calcLevelingCosts(props.skillName, skill.level);
  const canLevelArr = CalcCanLevelup(props.player, levelingCosts);
  const canLevel = canLevelUp(canLevelArr);
  const description = SkillDefinitions[props.skillName].dynamicDescription ? SkillDefinitions[props.skillName].dynamicDescription!(props.player) : SkillDefinitions[props.skillName].description;
  return (
    <div
      className={'skillrow forthis ' + (canLevel ? 'clickable' : '')}
      onClick={() => {if (canLevel) props.skillLevelup()}}
    >
      <div className='skilllevel'>{skill.level}</div>
      <div className='skilltextcontainer'>
        <div className='skilltext'>{skill.name}</div>
        <SkillUpgradeCosts costs={levelingCosts} canLevelArr={canLevelArr} skillName={props.skillName}/>
      </div>
      <div className="showthat" dangerouslySetInnerHTML={{__html: description}}></div>
    </div>
  )
}

const SkillUpgradeCosts = (props: {costs: SkillLevelingCosts, canLevelArr: SkillCanLevelUpArr, skillName: SkillName}) => {
  return (
    <div className='skillupgradecost'>
      {props.costs.map( c => {
        const canLevelItem = props.canLevelArr.find((item) => item.resourceName === c.resourceName);
        const canLevel = canLevelItem && canLevelItem.canLevel;
        const resText = resourceCost(c.resourceName, c.cost)
        return <span key={props.skillName + '-' + c.resourceName} className={canLevel ? '' : 'notenoughresource'}>{resText}</span>
      })}
    </div>
  );
}