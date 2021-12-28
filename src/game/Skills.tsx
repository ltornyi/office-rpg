import React from 'react';
import './Skills.css';
import { hasVisibleSkill, skillVisible } from '../utils/skillCalculations';
import { SkillEnumFromString } from '../utils/definitions';
import { Player } from '../utils/player';
import { Skill } from './Skill';


type SkillsPropType = {
  player: Player
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
          return <Skill player={props.player} skillName={skillnameEnum}/>
        else
          return null;
      })}
    </div>
  )
}
