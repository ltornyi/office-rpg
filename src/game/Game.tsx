import React from 'react';
import './Game.css';

export type gamePropsType = {
  selectedSlot: number
}

export const Game = (props: gamePropsType) => {
  return (
    <div>Game works, selected slot is {props.selectedSlot}</div>
  );
}
