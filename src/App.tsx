import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import './App.css';
import { Game } from './game/Game';
import { Menu } from './menu/Menu';

function App() {
  const [slotToLoad, setSlotToLoad] = useState(-1);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path='/' element={
        <Menu onSlotLoad={(slot: number) => {
          setSlotToLoad(slot);
          navigate('/game')
        }} />
      } />
      <Route path='/game' element={<Game selectedSlot={slotToLoad}/>} />
    </Routes>
  );
}

export default App;
