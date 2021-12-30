import React from 'react';
import './Resources.css';
import { ResourceEnumFromString } from '../../utils/definitions';
import { Tresources } from '../../utils/player';
import {Resource} from './Resource';


type ResourcesPropType = {
  resources: Tresources
}

export const Resources = (props: ResourcesPropType) => {
  return (
    <div className='gamepanel resourcescontainer'>
      <div className='resourcesheader'>Resources</div>
      {Object.keys(props.resources).map(resname => {
        const resnameEnum = ResourceEnumFromString(resname);
        if (resnameEnum && props.resources[resnameEnum].unlocked)
          return <Resource key={resname} resource={props.resources[resnameEnum]} />
        else
          return null;
      })}
    </div>
  )
}
