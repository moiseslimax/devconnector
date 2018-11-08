import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions'
import { Provider } from 'react-redux';
import store from './store'

import './App.css';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';


//check for tokens
if (localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticaded
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //LogoutUser
    store.dispatch(logoutUser());
    //clear 
    //redirect
    window.location.href = '/login'
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <div className="App">
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <div className="container">
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
          </div>
          <Footer/>
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
