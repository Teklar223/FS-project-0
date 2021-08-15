import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import { AuthContext } from "./helpers/AuthContext"
import { useState, useEffect } from "react";
import axios from "axios";
import React from 'react';


function App() {
  const [ authState, setAuthState] = useState({username : "", status: false});

  useEffect(() => {
    axios.get("https://full-stack-api-yonatan-ratner.herokuapp.com/user/auth" , {headers : {
      accessToken: localStorage.getItem("accessToken"),
    }}).then((response) => {
      if(response.data.error) {setAuthState({...authState, status: false});}
      else {setAuthState({username : response.data.username, status: true});}
    });
  }, [authState]);

  const logout = () => {
    window.location.reload()
    localStorage.removeItem("accessToken");
    setAuthState({username : "", status: false});    
  }

  return (
    <div className="App">     
      <AuthContext.Provider value={{ authState, setAuthState }}>
       <Router>
        <div className="navbar">
          <div className="links">
          {authState.status ? (
          <>
            <Link to="/"> Home </Link>
            <Link to={`/profile/${authState.username}`}> Profile </Link>
            <Link to="/createpost"> Create A Post </Link>
            </>
          ): (<h1> please login to view site content</h1>) }       
          </div>
          <div className="loggedInContainer">        
          {!authState.status ? (
            <>           
          <Link to="/login"> login </Link>
          <Link to="/registration"> register </Link>
          </>
          ) : (
          <>
            <h1> Welcome {authState.username}! </h1>
              <button onClick={logout}> Logout </button>
          </>
          )}        
          </div>
        </div>
         <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/createpost" exact component={CreatePost} />
          <Route path="/post/:id" exact component={Post} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/login" exact component={Login} />
          <Route path="/profile/:username" exact component={Profile}/>
          <Route path="/reset_password" exact component={ResetPassword}/>
          <Route path="*" exact component={PageNotFound} />
         </Switch>
       </Router>
       </AuthContext.Provider>
      </div>
  );
}

export default App;
