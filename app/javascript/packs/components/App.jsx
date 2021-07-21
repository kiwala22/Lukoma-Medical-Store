import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Header from './Header';
import 'antd/dist/antd.css'; 


const App = (props) => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get('/check_user',{
    })
    .then((response) => {
      if(response.data.email){
        setCurrentUser(response.data.email)
        console.log(response.data.email)
      } else {
        setCurrentUser(null);
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  const updateCurrentUser = (email) => {
    setCurrentUser(email);
  }

  return (
    <div>
      <Header currentUser={currentUser} updateCurrentUser={updateCurrentUser}/>
    </div>
  );

}


document.addEventListener('DOMContentLoaded', () => {

  const app = document.getElementById("root-app");
  app && (ReactDOM.render(<App />, app));

});