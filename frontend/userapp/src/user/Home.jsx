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
  const { isLoggedIn, isStudent, user, setUser } = useContext(AuthContext);
  const { isLoading, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  useEffect(() => {
    setBookmarked(null);

    console.log("user from home : ", user);

    let courseIds = user?.bookMarkedCourses?.map(course => course.courseId);

    courseIds = [...new Set(courseIds)];
    console.log("courseIds : ", courseIds);

    courseIds?.forEach(cId => {
      console.log("cId : ", cId);
      setBookmarked((prev) => ({
        ...prev,
        [cId]: true,
      }));
    })
    console.log("bookmarked after setting true : ", bookmarked);

    let url = isStudent ? "http://localhost:8000/courses/" : "http://localhost:8000/teacher/courses";
    if (!isLoggedIn) {
      url = "http://localhost:8000/courses/";
    }
    let headers = {};
    if (isLoggedIn) {
      console.log("user is loged in and now I am setting up header");
      headers =
      {

        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }

      console.log("headers : ", headers);

    }

    fetch(url, headers)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        if (isStudent) {
          console.log("loged in user is the student");
          setCourses(data.filter(d => d.status === "APPROVED"))
        } else {
          console.log("loged in user is the teacher");
          setCourses(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [isLoggedIn]);






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
            <Card
              course={course}
              bookmarked={bookmarked}
              setSelectedCourse={setSelectedCourse}
              setBookmarked={setBookmarked}
              setUser={setUser}
              courses={courses}
            />
          ))}
        </div>

        {selectedCourse && (
          <CourseDetail selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} toggleModal={toggleModal} />
        )}
      </div>
    </>
  );
}