import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; // Import Font Awesome Spinner
import VideoPlayer from "../student/VideoPlayer";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import Loading from "../shared/components/Loading";
import CourseDetail from "../shared/components/CourseDetail";
import Card from "../shared/components/Card";
import { authToken, captureHLSThumbnail, createMeeting } from "../API"


export default function CourseList({ toggleModal }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const { isLoggedIn, isStudent, user, setUser, query, setQuery } = useContext(AuthContext);
  const { isLoading, sendRequest, clearError } = useHttpClient();
  const [showLiveDialog, setShowLiveDialog] = useState(false); // State to control dialog visibility
  const [courseDetails, setCourseDetails] = useState({
    topic: "",
    duration: "",
    meetingId: "",
    scheduledTime: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setBookmarked(null);
    let courseIds = user?.bookMarkedCourses?.map((course) => course.courseId);
    courseIds = [...new Set(courseIds)];

    courseIds?.forEach((cId) => {
      setBookmarked((prev) => ({
        ...prev,
        [cId]: true,
      }));
    });

    let url = isStudent ? "http://localhost:8000/courses/" : "http://localhost:8000/teacher/courses";
    
    if (!isLoggedIn) {
      url = "http://localhost:8000/courses/";
    }

    let headers = {};
    if (isLoggedIn) {
      headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
    }

    fetch(url, headers)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses. Please try again later.");
        }
        return response.json();
      })
      .then((data) => {
        const approvedCourses = isStudent ? data.filter((d) => d.status === "ACTIVE") : data;
        setCourses(approvedCourses);
        setFilteredCourses(approvedCourses);
        console.log(filteredCourses);
        
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [isLoggedIn]);

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

        sendRequest(url, method);


        if (user && user.bookMarkedCourses) {
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

const handleLiveSubmit = async() => {
  const mid = await createMeeting();
  try {
    const response = await sendRequest(
      `http://localhost:8000/live/`, // Use the correct API endpoint for update
      'POST',
      JSON.stringify({
        courseId: selectedCourse.courseId,
        scheduledTime: courseDetails.scheduledTime,
        meetingId: mid,
        topic: courseDetails.topic,
        duration: courseDetails.duration,
      }),
      {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      }
    );
    setShowLiveDialog(false); // Close dialog after successful submission
  } catch (error) {
    console.error("Failed to create live session:", error);
  }
}


  // Effect to filter courses based on query
  useEffect(() => {
    console.log("query gets changed...", query);
    if (query.trim() === "") {
      // setFilteredCourses(courses);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.courseName.toLowerCase().includes(lowerCaseQuery) ||
        course.description.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredCourses(filtered);
    console.log('filter=',filtered)
  }, [query, courses]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="text-blue-500 text-5xl animate-spin" />
      </div>
    );

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

        {/* Error Message */}
        {error ? (
          <div className="flex flex-col items-center justify-center bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-semibold">Oops! Something went wrong. 😞</h2>
            <p className="mt-2 text-center">{error}</p>
            <button
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <Card
                course={course}
                bookmarked={bookmarked}
                setSelectedCourse={setSelectedCourse}
                setBookmarked={setBookmarked}
                setUser={setUser}
                courses={courses}
                toggleModal={toggleModal}
              />
            ))}
          </div>
        )}

        {selectedCourse && (
          <CourseDetail selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} toggleModal={toggleModal} handleLive={setShowLiveDialog}/>
        )}
      </div>

      {showLiveDialog && (
        <div className="fixed backdrop-blur-sm inset-0 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold ">Create Live Session</h2>
          <p className="text-sm mb-4">{selectedCourse.courseName}</p>
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={courseDetails.topic}
              onChange={(e) => setCourseDetails({ ...courseDetails, topic: e.target.value })}
            />
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={courseDetails.duration}
              onChange={(e) => setCourseDetails({ ...courseDetails, duration: e.target.value })}
            />
            {/* <label className="block text-sm font-medium mb-2">Meeting ID</label> */}
            {/* <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={courseDetails.meetingId}
              onChange={(e) => setCourseDetails({ ...courseDetails, meetingId: e.target.value })}
            /> */}
            <label className="block text-sm font-medium mb-2">Scheduled Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={courseDetails.scheduledTime}
              onChange={(e) => setCourseDetails({ ...courseDetails, scheduledTime: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowLiveDialog(false)} // Close dialog on cancel
              className="mr-4 py-2 px-4 bg-gray-300 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleLiveSubmit} // Submit live session details
              className="py-2 px-4 bg-blue-600 text-white rounded text-sm"
            >
              Create Live Session
            </button>
          </div>
        </div>
      </div>
      
      )}
    </>
  );
}
