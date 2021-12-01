import React from 'react';
import { WaterCooler } from './components/WaterCooler';
import './App.scss';

// The ID of the map cell we are in.
const params = new URLSearchParams(window.location.search);
const cell = params.get('cell') || 'test1234';

function App() {
  return (
    <div className="app">
      <WaterCooler cell={cell} />
    </div>
  );
}

export default App;
