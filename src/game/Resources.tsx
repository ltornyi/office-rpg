import React from 'react';
import { ResourceName } from '../utils/definitions';
import { Tresources } from '../utils/saveload';
import {Resource} from './Resource';

type ResourcesPropType = {
  resources: Tresources
}

export const Resources = (props: ResourcesPropType) => {
  return (
    <div className='gameresources'>
      <Resource resource={props.resources[ResourceName.ENERGY]} />
    </div>
  )
}
