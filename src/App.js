import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import AuthService from './services/AuthService';
import UserNav from './components/UserNav';


class App extends Component {

  constructor(props){
    super(props);
    this.auth = new AuthService();
    this.onStorageChange = this.onStorageChange.bind(this);
    this.state = {auth: this.auth.loggedIn()};//this.state.auth
    window.addEventListener('storage',this.onStorageChange);
  }

  componentDidMount() {
  }

  render() {
    if(this.state.auth){
      return (
        <UserNav onAuthChange={this.onAuthChange.bind(this)}></UserNav>
      );
    }
    return (
      <Router>
        <div>
        <Switch>
        <Route path="/Login"  render={routeProps => <Login {...routeProps} onAuthChange={this.onAuthChange.bind(this)}/>}></Route>
        <Redirect from='*'  to='/Login'/>
        </Switch>
        </div>
      </Router>
    );
  }

  onAuthChange(){
    this.setState({auth:this.auth.loggedIn()});
  }

  onStorageChange(ev){
    this.setState({auth:this.auth.loggedIn()});
  }

}

export default App;
