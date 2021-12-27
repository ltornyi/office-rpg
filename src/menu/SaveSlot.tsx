import React from 'react';
import { SaveSlotInfo } from '../utils/saveload';

export type SaveSlotProps = {
  slot: number,
  selectedSlot: number,
  info: SaveSlotInfo,
  onclick: Function
}

export const SaveSlot = (props: SaveSlotProps) => {
  const slotLabel = props.info.exists && props.info.lastUpdateTimeStamp ?
    (new Date(props.info.lastUpdateTimeStamp)).toLocaleString() :
    'Empty';

  const classes = `saveslot slot${props.slot} ` + (props.selectedSlot === props.slot ? 'selected' : '');

  return (
    <div className={classes} onClick={() => props.onclick()}>{slotLabel}</div>
  )
}