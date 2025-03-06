import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import { useCallback, useEffect, useState } from 'react'
import {AuthContext} from './auth-context'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import Auth from './Auth';
import Card from './Card';
import Home from './Home';
import { ToastContainer } from 'react-toastify';
import Details from './Details';
import VideoMeeting from './tem';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const login = (token)=>{
    setIsLoggedIn(true);
    setAuthToken(token);
  };
  const logout = useCallback(()=> {
    setAuthToken(null);
    setIsLoggedIn(false);
  })

  let routes;
  if(isLoggedIn){
     routes = (
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/details" element={<Details/>}/>
        <Route path="/video" element={<VideoMeeting/>} />
      </Routes>
     );
  }else{
    routes = <Auth/>
  }

  return (
    <>
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        authToken: authToken
      }}>
    <Router>
      <Navbar/>
      <main>{routes}</main>
      <ToastContainer
            position="bottom-center"
            autoClose={3000} // duration in ms
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
    </Router>
    </AuthContext.Provider>
    </>
  )
}
