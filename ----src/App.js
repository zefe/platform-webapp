import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './services/AuthService';
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {

  constructor(props){
    super(props);
    this.auth = new AuthService();
    this.state = {auth: this.auth.isLoggedIn()};
  }

  render() {
    if(this.state.auth){
      return(<Home></Home>);
    }
    return (<Login></Login>);
  }
}

export default App;

