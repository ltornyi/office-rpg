import React from 'react';
import { skillVisible } from '../utils/calculations';
import { SkillEnumFromString } from '../utils/definitions';
import { Player } from '../utils/saveload';
import './Skills.css';

type SkillsPropType = {
  player: Player
}

export const Skills = (props: SkillsPropType) => {
  return (
    <div className='gamepanel skillscontainer'>
      <div className='skillsheader'>Skills</div>
      {Object.keys(props.player.skills).map(skillname => {
        const skillnameEnum = SkillEnumFromString(skillname);
        if (skillnameEnum && skillVisible(props.player, skillnameEnum))
          return <div key={skillname} >{skillname}</div>
        else
          return null;
      })}
    </div>
  )
}
