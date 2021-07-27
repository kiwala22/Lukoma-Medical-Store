import React from "react";
import ReactDOM from "react-dom";
import "./css/Antd.less";
import "./css/App.css";
import Routes from "./routes/index";

const App = (props) => {
  return <>{Routes}</>;
};

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("root-app");
  app && ReactDOM.render(<App />, app);
});
