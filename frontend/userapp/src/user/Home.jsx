// Home.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import VideoPlayer from "../student/VideoPlayer";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import Loading from "../shared/components/Loading";
import CourseDetail from "../shared/components/CourseDetail";
import Card from "../shared/components/Card";

export default function CourseList({ toggleModal }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const { isLoggedIn, isStudent, user,setUser } = useContext(AuthContext);
  const { isLoading, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  useEffect(() => {

    console.log("user from home : ", user);

    let courseIds = user?.bookMarkedCourses?.map(course => course.courseId);
    console.log("courseIds : ", courseIds);

    courseIds?.forEach(cId => {
      console.log("cId : ", cId);
      setBookmarked((prev) => ({
        ...prev,
        [cId]: true,
      }));
    })
    console.log("prev after setting true : ", bookmarked);

    fetch("http://localhost:8000/courses/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setCourses(data.filter(d => d.status === "APPROVED"));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleBookmarkToggle = async (courseId) => {
    try {
      console.log("user in toggle : ", user);
      let userId = user?.user.userId;
      if (!(!!user)) {
        window.alert("Please login first...");
        return;
      }
      setBookmarked((prev) => {
        const isBookmarked = !!prev[courseId];
        const url = isBookmarked
          ? `http://localhost:8000/courses/remove-bookmark/${courseId}/${userId}`
          : `http://localhost:8000/courses/bookmark/${courseId}/${userId}`;

        const method = isBookmarked ? "DELETE" : "POST";

        sendRequest(url,method);

        
        if(user && user.bookMarkedCourses){
          user.bookMarkedCourses = user.bookMarkedCourses.filter(c => c?.courseId != courseId);
          setUser(user);
        }

        return {
          ...prev,
          [courseId]: !isBookmarked,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };



  

  if (loading)
    return <div className="text-center text-xl font-bold p-6">Loading courses...</div>;
  if (error) return <div className="text-center text-red-600 p-6">Error: {error}</div>;

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between shadow-lg mb-6">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Welcome to <span className="text-yellow-300">eShiksha</span> 🚀
            </h1>
            <p className="text-lg md:text-xl mt-4">
              Unlock your potential with world-class courses taught by industry experts.
            </p>
            <button className="mt-6 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition">
              Explore Courses →
            </button>
          </div>
          <div className="mt-6 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src="https://cdn.leverageedu.com/blog/wp-content/uploads/2020/03/24185535/Online-Learning.png"
              className="w-full max-w-sm rounded-lg shadow-md"
              alt="Online Learning"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <Card course={course} bookmarked={bookmarked} />
          ))}
        </div>

        {selectedCourse && (
          <CourseDetail selectedCourse={selectedCourse} setSelectedCourse={ setSelectedCourse} toggleModal={toggleModal} />
        )}
      </div>
    </>
  );
}