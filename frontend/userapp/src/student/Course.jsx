import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { parse } from "iso8601-duration";
import { AuthContext } from "../shared/context/auth-context";

export default function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ star: 5, comment: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [doubtInput, setDoubtInput] = useState(""); 

  const { isLoggedIn, userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        
        const data = await response.json();
        setCourse(data);
        setReviews(data.reviews || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="text-center text-2xl font-semibold mt-10">Loading course...</div>;
  if (error) return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Error: {error}</div>;
  if (!course) return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Course Not Found! 😢</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Left Section - Course Info */}
      <div className="w-[70%]">
        {!selectedLesson ? (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800">{course.courseName}</h1>
            <img 
              src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`} 
              alt={course.courseName} 
              className="w-full h-52 object-cover rounded-lg mt-3 shadow-md"
            />
            <p className="text-gray-600 mt-4">{course.description}</p>

            <div className="mt-4 space-y-2">
              <p><strong className="text-gray-700">Instructor:</strong> {course.teacher.user.firstName}</p>
              <p><strong className="text-gray-700">Duration:</strong> {course.duration}</p>
            </div>

            {/* Lessons */}
            <h3 className="text-xl font-semibold mt-6 mb-3">What You'll Learn:</h3>
            <ul className="space-y-2">
              {course.lessions.map((lesson, index) => (
                <li key={index} className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm transition hover:bg-blue-100 cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}>
                  <span className="text-blue-600 font-semibold mr-2">▶</span>
                  <span className="text-gray-800">{lesson.title}</span>
                </li>
              ))}
            </ul>

            {/* Video Section */}
            <h3 className="text-xl font-semibold mt-6">Demo Video</h3>
            <div className="mt-4 border rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer src={`http://localhost:8000/courses/stream/${course.courseId}`} />
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Course Reviews</h2>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-lg text-gray-800 mr-3">{review.name}</span>
                            <div className="flex items-center">
                              {[...Array(review.star)].map((_, i) => (
                                <span key={i} className="text-yellow-500 text-lg">★</span>
                              ))}
                              {[...Array(5 - review.star)].map((_, i) => (
                                <span key={i} className="text-gray-300 text-lg">★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                        {isLoggedIn && (
                          <button
                            onClick={() => handleUpdateReview(review)}
                            className="ml-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Lesson View
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedLesson.title}</h2>
            <p className="text-gray-600 mt-2">{selectedLesson.description}</p>

            <div className="mt-4 border rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer src={`http://localhost:8000/lessions/stream/${courseId}/${selectedLesson.lessionId}`} />
            </div>

            {/* Doubt Submission */}
            <textarea
              value={doubtInput}
              onChange={(e) => setDoubtInput(e.target.value)}
              placeholder="Enter your doubt here..."
              className="w-full p-2 border rounded-lg mt-4"
              rows="4"
            />
            <button
              onClick={() => alert("Doubt Submitted!")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Doubt
            </button>

            <button
              onClick={() => setSelectedLesson(null)}
              className="mt-4 block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              ⬅️ Back to Course Info
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar - Course Lessons */}
      <div className="w-[30%] bg-white p-4 rounded-xl shadow-md sticky top-4 h-[500px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Lessons</h3>
        {course.lessions.map((lesson, index) => (
          <div key={index} className="p-3 rounded-lg text-gray-800 hover:bg-blue-100 transition cursor-pointer"
            onClick={() => setSelectedLesson(lesson)}>
            {lesson.title}
          </div>
        ))}
      </div>
    </div>
  );
}
