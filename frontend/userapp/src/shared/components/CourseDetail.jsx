import React, { useContext } from 'react'
import { AuthContext } from '../context/auth-context';
import VideoPlayer from '../../student/VideoPlayer';
import { Link, NavLink } from 'react-router-dom';

export default function CourseDetail({ selectedCourse, setSelectedCourse, toggleModal }) {
  const { isLoggedIn, isStudent, user, setUser } = useContext(AuthContext);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setSelectedCourse(null);
    }
  };

  const isNotEnrolled = (courseId) => {
    user.enrolledCourses[0]?.courseId != selectedCourse?.courseId || !user.enrolledCourses;

    const c = user?.enrolledCourses?.find(enrolledCourse => enrolledCourse.courseId == courseId);

    if (c) return false;

    return true;
  }
  return (
    <div>
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={handleOutsideClick}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold text-gray-800">{selectedCourse?.courseName}</h2>
          <p className="text-gray-600 mt-2">{selectedCourse?.description}</p>
          <p className="text-gray-800 font-semibold mt-2">Instructor: {selectedCourse?.teacher.user.firstName}</p>
          <p className="text-gray-800 font-semibold mt-2">Duration: {selectedCourse?.duration}</p>

          <h3 className="text-lg font-bold mt-4 text-gray-700">What You Will Learn:</h3>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {selectedCourse?.lessions.map((lession, index) => (
              <li key={index}>{lession.title}</li>
            ))}
          </ul>

          <>
            <h3 className="text-lg font-bold mt-4 text-gray-700">Demo Video:</h3>
            <div className="mt-2">
              <VideoPlayer src={`http://localhost:8000/courses/stream/${selectedCourse?.courseId}`} />
            </div>
          </>

          <h3 className="text-xl font-bold mt-6 mb-4 text-gray-900">Student Reviews:</h3>

          {selectedCourse?.reviews.length > 0 ? (
            <div className="space-y-6">
              {selectedCourse?.reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex items-start space-x-5 border border-gray-200">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
                      <span className="text-xl font-bold text-white">
                        {review.user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg text-gray-900">{review.user.firstName} {review.user.lastName}</span>

                        {/* Star Ratings */}
                        <div className="flex">
                          {[...Array(review.star)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.103 8.63 6.594 3.95 10 0l3.406 3.95 5.49 4.68L14.755 11.54 15.878 18z" />
                            </svg>
                          ))}
                          {[...Array(5 - review.star)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.103 8.63 6.594 3.95 10 0l3.406 3.95 5.49 4.68L14.755 11.54 15.878 18z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Reviews Message
            <div className="bg-gray-100 p-6 rounded-lg text-center shadow-md">
              <p className="text-gray-600 text-lg font-medium">No reviews yet! Be the first to leave a review. 🎉</p>
            </div>
          )}


          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                setSelectedCourse(null)
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>

            {isLoggedIn && isStudent && (isNotEnrolled(selectedCourse?.courseId) ? (<Link to={`/enroll/${selectedCourse?.courseId}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Enroll Now
              </button>
            </Link>
            ) : (
              <Link to={`/course/${selectedCourse?.courseId}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Go to Course
                </button>
              </Link>
            ))
            }

            {!isStudent && isLoggedIn &&
              <Link to={`/upload-lession/${selectedCourse?.courseId}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Lession
                </button>
              </Link>}

            {!isLoggedIn && <button
              onClick={toggleModal}
              className="text-blue-900 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer"
            >
              Sign In to enroll
            </button>}
          </div>
        </div>
      </div>
    </div>
  )
}
