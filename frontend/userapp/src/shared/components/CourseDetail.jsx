import React, { useContext } from 'react'
import { AuthContext } from '../context/auth-context';
import VideoPlayer from '../../student/VideoPlayer';

export default function CourseDetail({selectedCourse,setSelectedCourse,toggleModal, handleLive}) {
  const { isLoggedIn, isStudent, user,setUser } = useContext(AuthContext);

    const handleOutsideClick = (e) => {
        if (e.target.id === "modal-overlay") {
          setSelectedCourse(null);
        }
      };
  return (
    <div>
      <div
            id="modal-overlay"
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
            onClick={handleOutsideClick}
          >
<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>              
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

              <h3 className="text-lg font-bold mt-6 mb-4 text-gray-800">Student Reviews:</h3>
              <div className="space-y-4">
                {selectedCourse.reviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-5 flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-700">{review.user.firstName.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800 mr-2">{review.user.firstName}</span>
                          <div className="flex items-center">
                            {[...Array(review.star)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.103 8.63 6.594 3.95 10 0l3.406 3.95 5.49 4.68L14.755 11.54 15.878 18z" />
                              </svg>
                            ))}
                            {[...Array(5 - review.star)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.103 8.63 6.594 3.95 10 0l3.406 3.95 5.49 4.68L14.755 11.54 15.878 18z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {/* <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span> */}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
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

                {isLoggedIn && isStudent && ((user.enrolledCourses[0]?.courseId != selectedCourse.courseId || !user.enrolledCourses) ? (<Link to={`/enroll/${selectedCourse.courseId}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Enroll Now
                  </button>
                </Link>
                ) : (
                  <Link to={`/course/${selectedCourse.courseId}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Go to Course
                    </button>
                  </Link>
                ))
                }

                {!isStudent && isLoggedIn && <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Update Now
                </button>}
                {/* ...................k_dev ........... */}
                {!isStudent && isLoggedIn && <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700" onClick={() =>handleLive(true)}>
                  Schedule Live
                </button>}
                {/* ........................k_dev....................... */}
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
