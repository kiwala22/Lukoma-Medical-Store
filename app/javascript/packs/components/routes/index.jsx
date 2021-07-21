import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "../Dashboard";
import Login from "../LoginForm"

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route exact path='/users/sign_in' component={Login} />
    </Switch>
  </Router>
);