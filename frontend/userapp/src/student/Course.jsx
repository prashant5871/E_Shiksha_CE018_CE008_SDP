
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { parse } from 'iso8601-duration';
import { AuthContext } from "../shared/context/auth-context";
import { VideoPreview } from "../shared/components/VideoPreview";


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
  const [doubtInput, setDoubtInput] = useState(""); // State for doubt input


  const { isLoggedIn, userId, user } = useContext(AuthContext);



  function formatIsoDuration(isoDuration) {
    if (!isoDuration) {
      return "00:00:00"; // Or handle it as you see fit (e.g., return "N/A")
    }

    try {
      const duration = parse(isoDuration);
      let hours = duration.hours || 0;
      let minutes = duration.minutes || 0;
      let seconds = duration.seconds || 0;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } catch (error) {
      console.error("Error parsing ISO duration:", error);
      return isoDuration; // Return the original string on error
    }
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);

        let sortedReviews = data.reviews || [];

        // Move the logged-in user's review to the front
        sortedReviews = sortedReviews.sort((a, b) => (a.user.userId === userId ? -1 : b.user.userId === userId ? 1 : 0));

        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, userId]); // Added `userId` as a dependency


  const handleDoubtSubmit = async () => {
    if (!selectedLesson) return;

    try {
      const response = await fetch(`http://localhost:8000/doubts/${selectedLesson.lessionId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Send JSON
        },
        body: JSON.stringify({ doubt: doubtInput }), // Send doubt as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to submit doubt');
      }

      alert("Doubt submitted successfully!"); // Or display a more user-friendly message
      setDoubtInput(""); // Clear the input after submission
    } catch (err) {
      console.error('Error submitting doubt:', err);
      alert("Failed to submit doubt. Please try again.");
    }
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = isUpdating ? { ...reviewToUpdate, ...newReview } : newReview;
      const method = isUpdating ? 'PUT' : 'POST';
      console.log(reviewToUpdate);
      const url = isUpdating ? `http://localhost:8000/review/${reviewToUpdate.reviewId}` : `http://localhost:8000/review/${courseId}/${userId}`;

      console.log("review data : ", reviewData);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(isUpdating ? 'Failed to update review' : 'Failed to submit review');
      }

      const updatedReview = await response.json();
      console.log("updated review : ", updatedReview);

      if (isUpdating) {
        setReviews(reviews.map(review => review.reviewId === updatedReview.reviewId ? updatedReview : review));
        setIsUpdating(false);
        setReviewToUpdate(null);
      } else {
        setReviews([...reviews, updatedReview]);
      }
      setNewReview({ name: "", star: 5, comment: "" });
    } catch (err) {
      console.error(isUpdating ? 'Error updating review:' : 'Error submitting review:', err);
    }
  };

  const isReviewdByUser = () => {
    if (isUpdating) return false;
    const reviewdByCurrUser = course.reviews.find(review => review.user.userId == userId);

    // console.log("reviews are : ",reviews);

    // console.log("recu : ",reviewdByCurrUser);

    if (reviewdByCurrUser != null) {
      return true;
    }

    return false;
  }

  const handleUpdateReview = (review) => {
    setIsUpdating(prev => !prev);
    setReviewToUpdate(review);
    setNewReview({ star: review.star, comment: review.comment });
  };

  if (loading) {
    return <div className="text-center text-2xl font-semibold mt-10">Loading course...</div>
  }

  if (error) {
    return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Error: {error}</div>
  }

  if (!course) {
    return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Course Not Found! 😢</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      <div className="w-[70%]">
        {!selectedLesson && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800">{course.courseName}</h1>
            <img src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`} alt={course.courseName} className="w-full h-48 object-cover rounded-lg mt-3" />
            <p className="text-gray-600 mt-4">{course.description}</p>

            <div className="mt-4">
              <p><strong>Instructor:</strong> {course.teacher.user.firstName}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
            </div>

            <h3 className="text-xl font-semibold mt-6">What You'll Learn:</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              {course.lessions.map((lesson, index) => (
                <li key={index}>{lesson.title}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold my-6">Demo Video</h3>
            <VideoPlayer src={`http://localhost:8000/courses/stream/${course.courseId}`} />

            <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Course Reviews</h2>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 px-4 py-3 bg-white shadow-sm rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* User Info */}
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-lg text-gray-900 mr-3 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                              {review.user.firstName} {review.user.lastName}
                            </span>
                            {/* Star Ratings */}
                            <div className="flex items-center space-x-1">
                              {[...Array(review.star)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-500 fill-current drop-shadow-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
                          {/* Review Comment */}
                          <p className="text-gray-700 leading-relaxed text-base border-l-4 border-blue-500 pl-3">{review.comment}</p>
                        </div>

                        {/* Update Button */}
                        {isLoggedIn && review.user.userId == userId && (
                          <button
                            onClick={() => handleUpdateReview(review)}
                            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out"
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

              <div className="mt-8">
                {!isReviewdByUser() && <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{isUpdating ? 'Update Review' : 'Leave a Review'}</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="star" className="block text-sm font-medium text-gray-700">Rating</label>
                      <select
                        id="star"
                        value={newReview.star}
                        onChange={(e) => setNewReview({ ...newReview, star: parseInt(e.target.value) })}
                        className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num} Stars
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                      <textarea
                        id="comment"
                        placeholder="Write your review..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-colors font-semibold"
                      >
                        {isUpdating ? 'Update Review' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
                }
              </div>
            </div>
          </div>
        )}

        {selectedLesson && (
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedLesson.title}</h2>
            <p className="text-gray-600 mt-2">{selectedLesson.description}</p>

            <div className="mt-4">
              <VideoPlayer src={`http://localhost:8000/lessions/stream/${courseId}/${(selectedLesson.lessionId)}`} />
            </div>

            {/* Input field for doubt */}
            <textarea
              value={doubtInput}
              onChange={(e) => setDoubtInput(e.target.value)}
              placeholder="Enter your doubt here..."
              className="w-full p-2 border rounded-lg mt-4"
              rows="4"
            />

            <button
              onClick={handleDoubtSubmit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Doubt
            </button>
          </div>
        )}



        {selectedLesson && (
          <button
            onClick={() => setSelectedLesson(null)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            ⬅️ Back to Course Info
          </button>
        )}
      </div>

      <div className="w-[30%] bg-white p-4 rounded-xl shadow-md sticky top-4 h-[500px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Lessons</h3>
        {course.lessions.map((lesson, index) => (
          <div
            key={index}
            onClick={() => setSelectedLesson(lesson)}
            className="flex items-center gap-4 cursor-pointer bg-gray-100 p-3 rounded-lg hover:bg-gray-200 mb-2 transition-shadow shadow-sm hover:shadow-md"
          >
            {/* Video Preview (Left Side) */}
            <div className="w-24 h-16 overflow-hidden rounded-md">
              <VideoPreview src={`http://localhost:8000/lessions/stream/${courseId}/${lesson.lessionId}/master.m3u8`} />
              {/* hi */}
            </div>

            {/* Lesson Details (Right Side) */}
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">{lesson.title}</p>
              <span className="text-gray-500 text-sm">⏳ {formatIsoDuration(lesson.duration)}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}