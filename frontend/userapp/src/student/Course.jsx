
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { parse } from 'iso8601-duration';
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
  const [doubtInput, setDoubtInput] = useState(""); // State for doubt input


  const { isLoggedIn, userId } = useContext(AuthContext);


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
        setReviews(data.reviews || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleDoubtSubmit = async () => {
    if (!selectedLesson) return;

    try {
      const response = await fetch(`http://localhost:8000/doubts/${selectedLesson.lessionId}/${loggedInUserId}`, {
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
      const url = isUpdating ? `http://localhost:8000/review/${reviewToUpdate.id}` : `http://localhost:8000/review/${courseId}/${userId}`;

      console.log("review data : ", reviewData);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(isUpdating ? 'Failed to update review' : 'Failed to submit review');
      }

      const updatedReview = await response.json();

      if (isUpdating) {
        setReviews(reviews.map(review => review.id === updatedReview.id ? updatedReview : review));
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

  const handleUpdateReview = (review) => {
    setIsUpdating(true);
    setReviewToUpdate(review);
    setNewReview({ name: review.name, star: review.star, comment: review.comment });
  };

  if (loading) {
    return <div className="text-center text-2xl font-semibold mt-10">Loading course...</div>;
  }

  if (error) {
    return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return <div className="text-center text-2xl font-semibold mt-10 text-red-500">Course Not Found! 😢</div>;
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

            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Course Reviews</h2>

              <div className="mt-4 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b pb-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{review.name}</span>
                        <div className="text-yellow-500 text-lg">
                          {"⭐".repeat(review.star)}
                        </div>
                        {isLoggedIn && (
                          <button onClick={() => handleUpdateReview(review)}>Update</button>
                        )}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">{isUpdating ? 'Update Review' : 'Leave a Review'}</h3>
                <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">

                  <select
                    value={newReview.star}
                    onChange={(e) => setNewReview({ ...newReview, star: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-font-medium rounded-lg shadow-md transition-all"
                  >
                    {isUpdating ? 'Update Review' : 'Submit Review'}
                  </button>
                </form>
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
            className="cursor-pointer bg-gray-100 p-3 rounded-lg hover:bg-gray-200 mb-2"
          >
            {lesson.title} <span className="text-gray-500">({formatIsoDuration(lesson.duration)})</span>
          </div>
        ))}
      </div>
    </div>
  );
}