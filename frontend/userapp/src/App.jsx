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
    setUserMail(uid, umail, authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsStudent(true);
    setUserId(null);
  }, []);
  
  let routes;
  if (isLoading) {
    routes = <Loading />;
  } else if (isLoggedIn) {
    routes = (
      <Routes>
        {/* <Route exact path="/" element={<Home />} /> */}
        <Route path="/" element={<>hello world</>} />
        {/* <Route path="/wishlist" element={<WishList />} /> */}
        {/* <Route path="/triplist" element={<TripList />} /> */}
        {/* <Route path="/allBookings" element={<AllBookings />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}


        {/* <Route exact path="/payment" element={<Payment />} /> */}
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        {/* <Route exact path="/" element={<Home />} /> */}\
        <Route path="/" element={<>hello world</>} />

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
    </AuthContext.Provider>
    </>
  )
}

export default App


