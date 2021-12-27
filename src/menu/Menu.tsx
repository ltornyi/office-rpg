import React, { useState } from 'react';
import './Menu.css';
import { deleteSaveSlot, getSaveSlotInfo } from '../utils/saveload';
import { SaveSlot } from './SaveSlot';

export type menuPropsType = {
  onSlotLoad: Function,
  initialSlotSelection: number;
}

export const Menu = (props: menuPropsType) => {
  const [selectedSlot, setSelectedSlot] = useState(props.initialSlotSelection);
  const [slots, setSlots] = useState([getSaveSlotInfo(0), getSaveSlotInfo(1), getSaveSlotInfo(2)]);

  const deleteSlot = () => {
    deleteSaveSlot(selectedSlot);
    setSlots([getSaveSlotInfo(0), getSaveSlotInfo(1), getSaveSlotInfo(2)]);
  }

  return (
    <div className='menucontainer'>
      <SaveSlot selectedSlot={selectedSlot} slot={0} info={slots[0]} onclick={()=> setSelectedSlot(0)} />
      <SaveSlot selectedSlot={selectedSlot} slot={1} info={slots[1]} onclick={()=> setSelectedSlot(1)} />
      <SaveSlot selectedSlot={selectedSlot} slot={2} info={slots[2]} onclick={()=> setSelectedSlot(2)} />
      <div className='deletegame'>
        <button onClick={deleteSlot} disabled={selectedSlot === -1 || !slots[selectedSlot].exists}>Delete</button>
      </div>
      <div className='loadgame'>
        <button onClick={() => props.onSlotLoad(selectedSlot)} disabled={selectedSlot === -1}>Load</button>
      </div>
    </div>
  );
}
