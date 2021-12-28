import React from 'react';
import './GameHeader.css';

export const GameHeader = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  return (
    <div className='gamepanel gameheader'>
      {props.children}
    </div>
  )
}
