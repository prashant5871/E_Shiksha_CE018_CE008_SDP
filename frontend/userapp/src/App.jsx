import { useState, useCallback } from 'react'
import Navbar from './shared/components/Navbar'
import './App.css'
import { AuthContext } from './shared/context/auth-context'
import { useHttpClient } from './shared/hooks/http-hook'
import { ToastContainer } from 'react-toastify'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Home from './user/Home'
import Footer from './shared/components/Footer'
import Saved from './student/Saved'
import Course from './student/Course'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  const [userMail, setUserMail] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const login = useCallback((uid, umail, authToken) => {
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
    setUserId(uid);
    setUserMail(umail);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsStudent(true);
    setUserId(null);
    setUserMail(null);
  }, []);
  
  let routes;
  if (isLoading) {
    console.log("Loading...");
    routes = <Loading />;
  } else if (isLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/course/{courseId}" element={<Course/>}/>

        {/* <Route path="/" element={<>hello world</>} /> */}
        {/* <Route path="/triplist" element={<TripList />} /> */}
        {/* <Route path="/allBookings" element={<AllBookings />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}


        {/* <Route exact path="/payment" element={<Payment />} /> */}
      </Routes>
    );
  } else {
    console.log("not loged in...");
    routes = (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />}/>
        <Route path="/course/:courseId" element={<Course/>}/>
        {/* <Route path="/" element={<>hello world</>} /> */}

      </Routes>
    );
  }
  return (
    <>
    <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      userMail: userMail,
      login: login,
      logout: logout,
      isStudent: isStudent,
      setIsStudent: setIsStudent,
    }}
    >
    <Router>
    <Navbar />
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
    <Footer/>
    </AuthContext.Provider>
    </>
  )
}

export default App


