import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';

const Header = (props) => {

    console.log(props.currentUser);

{/* <Route exact path='/' handleLogin={handleLogin} render={props => <Landing {...props} user={user.toString()} handleLogin={handleLogin} />} /> */}
    return (
        <div className="App">
          <Router>
            <Route exact path='/' component={Dashboard} />
            <Route exact path='/users/sign_in' component={LoginForm} />
          </Router>
        </div>
    );

}

export default Header;