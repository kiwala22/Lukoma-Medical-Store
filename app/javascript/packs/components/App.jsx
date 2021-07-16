import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';


document.addEventListener('DOMContentLoaded', () => {

  const dashboard = document.getElementById("root-app");//$('#root-app');
  dashboard && (ReactDOM.render(<Dashboard />, dashboard));

  const login = document.getElementById("login-app");//$('#login-app');
  login && (ReactDOM.render(<LoginForm />, login));

});