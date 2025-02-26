// Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "../student/VideoPlayer";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookmarked, setBookmarked] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/courses/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleBookmarkToggle = (courseId) => {
    setBookmarked((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setSelectedCourse(null);
    }
  };

  if (loading)
    return <div className="text-center text-xl font-bold p-6">Loading courses...</div>;
  if (error) return <div className="text-center text-red-600 p-6">Error: {error}</div>;

  return (
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
          <div
            key={course.courseId}
            onClick={() => setSelectedCourse(course)}
            className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl"
          >
            <div
              className="absolute top-3 right-3 cursor-pointer text-gray-400 text-2xl"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkToggle(course.id);
              }}
            >
              {bookmarked[course.id] ? "❤️" : "🤍"}
            </div>

            <img
              className="w-full h-48 object-cover rounded-t-xl"
              src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`}
              alt={course.courseName}
            />
            <div className="p-6">
              <div className="font-bold text-xl text-gray-800">{course.courseName}</div>
              <p className="text-gray-600 text-sm mt-2">{course.description}</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">{course.duration}</p>
              <p className="text-lg font-semibold text-green-800 mt-2">{course.price} rupees</p>
            </div>
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {course.teacher.user.firstName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.courseName}</h2>
            <p className="text-gray-600 mt-2">{selectedCourse.description}</p>
            <p className="text-gray-800 font-semibold mt-2">Instructor: {selectedCourse.teacher.user.firstName}</p>
            <p className="text-gray-800 font-semibold mt-2">Duration: {selectedCourse.duration}</p>

            <h3 className="text-lg font-bold mt-4 text-gray-700">What You Will Learn:</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {selectedCourse.lessions.map((lession, index) => (
                <li key={index}>{lession.title}</li>
              ))}
            </ul>

            <>
              <h3 className="text-lg font-bold mt-4 text-gray-700">Demo Video:</h3>
              <div className="mt-2">
                <VideoPlayer src={`http://localhost:8000/courses/stream/${selectedCourse.courseId}`} />
              </div>
            </>

            <h3 className="text-lg font-bold mt-4 text-gray-700">Student Reviews:</h3>
            <div className="mt-2 space-y-2">
              {selectedCourse.reviews.map((review, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <p className="font-semibold">{review.name} ⭐ {review.rating}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
              <Link to={`/enroll/${selectedCourse.id}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Enroll Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}