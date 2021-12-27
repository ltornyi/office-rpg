import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import { Game } from './game/Game';
import { Menu } from './menu/Menu';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Menu />} />
      <Route path='/game' element={<Game />} />
    </Routes>
  );
}

export default App;
