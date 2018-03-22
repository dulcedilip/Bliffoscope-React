'use-strict';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import StarShip from './components/starship.component';
class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.prepareTorpedoStarShipData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Bliffoscope </h1>
        </header>
        <StarShip></StarShip>        
      </div>
    );
  }
}

export default App;
