import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './pages/Map';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Redistricting in North Carolina</h1>
        <h3>Demo Version</h3>
      </header>
      <section>
        <p>
          We have developed a demo app to map out statewide and local
          decisions in redistricting. Interactive layers make it possible
          to analyze district lines based on age, race, environmental health, past elections,
          and other factors.
        </p>

        <Map/>

      </section>
    </div>
  );
}

export default App;
