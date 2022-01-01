import React from 'react';
import './Resource.css';
import { oneDecimal } from '../../utils/formatters';
import { resourceCapacity, resourceRegenRate } from '../calculations/resourceCalculations';
import { Player, Tresource } from '../definitions/player';

type ResourcePropType = {
  resource: Tresource,
  player: Player
}

export const Resource = (props: ResourcePropType) => {
  const regenPerSec = resourceRegenRate(props.resource);
  const capacity = resourceCapacity(props.resource, props.player);
  const value = props.resource.value;
  const progressPercent = Math.floor(value / capacity * 1000) / 10;
  
  return (
    <div className="resourcerow">
      <div className="resourcetext">
        <div className="reslabel">{props.resource.name}</div>
        <div className="resregen">{oneDecimal(regenPerSec)}/s</div>
        <div className="resvalue">{oneDecimal(value)}/{oneDecimal(capacity)}</div>
      </div>
      <div className="resourcebar">
        <div className="resprogress" style={{width: progressPercent + '%'}}></div>
      </div>
    </div>
  )
}