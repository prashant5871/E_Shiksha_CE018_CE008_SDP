import { useState, useCallback, useEffect } from "react";
import Navbar from "./shared/components/Navbar";
import "./App.css";
import { AuthContext } from "./shared/context/auth-context";
import { UploadProvider } from "./shared/context/UploadContext"; // Import UploadProvider
import { useHttpClient } from "./shared/hooks/http-hook";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./user/Home";
import Footer from "./shared/components/Footer";
import Saved from "./student/Saved";
import Course from "./student/Course";
import Enroll from "./student/Enroll";
import EnrolledCourses from "./student/EnrolledCourses";
import Verify from "./shared/components/Verify";
import CreateCourse from "./teacher/CreateCourse";
import LiveSessions from "./LiveSessions";
import LiveMeeting from "./live";
import UploadLession from "./teacher/UploadLession";
import ManageCourses from "./teacher/ManageCourses";
import UpdateCourse from "./teacher/UpdateCourse";
import MyDoubts from "./student/MyDoubts";
import Payment from "./shared/components/Payment";
import Lessons from "./teacher/Lessons";
import Doubts from "./teacher/Doubts";
import TeacherLesson from "./teacher/TeacherLesson";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userMail, setUserMail] = useState(null);
  const [isStudent, setIsStudent] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Function to verify JWT token with the backend
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Token is not present in localStorage");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/auth/jwt-varify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data?.isValid) {
        console.log("Token is valid:", data);
        setIsLoggedIn(true);
        setUserId(data.user.user.userId);
        setUserMail(data.user.user.email);
        setIsStudent(data.isStudent);
        setUser(data.user);
      } else {
        console.log("Token is invalid or expired:", data);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserId(null);
        setUserMail(null);
        setIsStudent(false);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("authToken");
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = useCallback((uid, umail, authToken, user, isEnabled) => {
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
    setUserId(uid);
    setUserMail(umail);
    setUser(user);
    setIsEnabled(isEnabled);
    setToken(authToken);
    console.log("User logged in:", localStorage.setItem("authToken", authToken));
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
    routes = <p>Loading...</p>;
  } else if (isLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home toggleModal={toggleModal} />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/saved" element={<Saved toggleModal={toggleModal} />} />
        <Route path="/enroll/:courseId" element={<Enroll />} />
        <Route path="/enrolled-courses" element={<EnrolledCourses />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/upload-lession/:courseId" element={<UploadLession />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/update-course/:courseId" element={<UpdateCourse />} />
        <Route path="/doubts/:courseId" element={<MyDoubts/>} />
        <Route path="/payment/:courseId" element={<Payment/>} />
        <Route path="/lessons/:courseId" element={<Lessons/>} />
        <Route path="lesson/doubts/:lessonId" element={<Doubts/>} />
        <Route path="teacher/lesson/:courseId/:lessonId" element={<TeacherLesson/>} />
        <Route path="/live" element={<LiveMeeting/>} />
        <Route path="/sessions" element={<LiveSessions/>} />


      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home toggleModal={toggleModal} />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/enroll/:courseId" element={<Enroll />} />
        <Route path="/enrolled-courses" element={<EnrolledCourses />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/live" element={<LiveMeeting/>} />
        <Route path="/sessions" element={<LiveSessions/>} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        userMail,
        login,
        logout,
        isStudent,
        setIsStudent,
        user,
        setUser,
        isEnabled,
        query,
        setQuery,
        token
      }}
    >
      <UploadProvider> {/* Wrap with UploadProvider */}
        <Router>
          <Navbar toggleModal={toggleModal} isModalOpen={isModalOpen} />
          <main>{routes}</main>
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
          <Footer />
        </Router>
      </UploadProvider>
    </AuthContext.Provider>
  );
}

export default App;
