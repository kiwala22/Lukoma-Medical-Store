import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Routes from "./routes/index";
import "./css/Antd.less";
import "./css/App.css"

const App = (props) => {

  return (
    <>
      {Routes};
    </>
  )
}


document.addEventListener('DOMContentLoaded', () => {

  const app = document.getElementById("root-app");
  app && (ReactDOM.render(<App />, app));

});