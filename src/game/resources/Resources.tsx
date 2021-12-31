import React from 'react';
import './Resources.css';
import { ResourceEnumFromString } from '../../utils/definitions';
import { Player } from '../../utils/player';
import {Resource} from './Resource';


type ResourcesPropType = {
  player: Player
}

export const Resources = (props: ResourcesPropType) => {
  return (
    <div className='gamepanel resourcescontainer'>
      <div className='resourcesheader'>Resources</div>
      {Object.keys(props.player.resources).map(resname => {
        const resnameEnum = ResourceEnumFromString(resname);
        if (resnameEnum && props.player.resources[resnameEnum].unlocked)
          return <Resource key={resname} resource={props.player.resources[resnameEnum]} player={props.player} />
        else
          return null;
      })}
    </div>
  )
}
