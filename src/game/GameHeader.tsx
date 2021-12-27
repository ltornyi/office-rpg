import React from 'react';

export const GameHeader = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  return (
    <div className='gameheader'>
      {props.children}
    </div>
  )
}
