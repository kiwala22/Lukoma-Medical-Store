import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Base from "../Base";
import Login from "../LoginForm";

export default (
  <Router>
    <Switch>
      <Route path="/users/sign_in/" component={Login} />
      <Route path="/" component={Base} />
    </Switch>
  </Router>
);
