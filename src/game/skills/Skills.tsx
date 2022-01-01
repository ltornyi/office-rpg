import React from 'react';
import './Skills.css';
import { hasVisibleSkill, skillVisible } from '../calculations/skillCalculations';
import { Player } from '../definitions/player';
import { Skill } from './Skill';
import { SkillEnumFromString, SkillName } from '../definitions/skillDefinitions';


type SkillsPropType = {
  player: Player,
  skillLevelup: (sk: SkillName) => void
}

export const Skills = (props: SkillsPropType) => {
  if (!hasVisibleSkill(props.player)) {
    return null;
  }

  return (
    <div className='gamepanel skillscontainer'>
      <div className='skillsheader'>Skills</div>
      {Object.keys(props.player.skills).map(skillname => {
        const skillnameEnum = SkillEnumFromString(skillname);
        if (skillnameEnum && skillVisible(props.player, skillnameEnum))
          return <Skill key={skillname} player={props.player} skillName={skillnameEnum} skillLevelup={() => props.skillLevelup(skillnameEnum)}/>
        else
          return null;
      })}
    </div>
  )
}
