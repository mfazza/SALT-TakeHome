import React from 'react';
import './App.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import Manager from './components/manager';

const App: React.FC = () => {
  return (
    <div className="App">

      <BrowserRouter>
        <h1>CryptoTrader</h1>
        <h2>Select your name below.</h2>
        <div className="master-bar">
          <Link to="/Dakota">Dakota</Link>
          {' '}
          <Link to="/Taylor">Taylor</Link>
          {' '}
          <Link to="/Alex">Alex</Link>
        </div>


        <Route path="/Dakota" render={() => <Manager name={"Dakota"} />}></Route>
        <Route path="/Taylor" render={() => <Manager name={"Taylor"} />}></Route>
        <Route path="/Alex" render={() => <Manager name={"Alex"} />}></Route>

      </BrowserRouter>
    </div>
  );
}


export default App;
