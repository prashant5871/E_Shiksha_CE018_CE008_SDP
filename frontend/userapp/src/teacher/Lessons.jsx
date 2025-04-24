import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Lessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/courses/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Function to format duration from ISO 8601 (e.g., "PT42M9S" → "42m 9s")
  const formatDuration = (isoDuration) => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "Unknown Duration";

    const [, hours, minutes, seconds] = match.map((v) => (v ? parseInt(v) : 0));
    return `${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""}`.trim();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading course details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-5 py-8">
      {/* Course Title */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{course.courseName}</h1>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.lessions && course.lessions.length > 0 ? (
          course.lessions.map((lesson) => (
            <div
              key={lesson.lessionId}
              className="bg-white shadow-lg rounded-lg overflow-hidden border transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
              onClick={() => navigate(`/teacher/lesson/${courseId}/${lesson.lessionId}`)}
            >
              {/* Lesson Title */}
              <div className="bg-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
              </div>

              {/* Lesson Details (Grow to fill space) */}
              <div className="p-6 flex-grow">
                <p className="text-gray-700 mb-3">{lesson.description}</p>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600">⏳ {formatDuration(lesson.duration)}</span>
              </div>

              {/* View Doubts Button (Always at bottom) */}
              <div className="p-4 bg-gray-100 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering navigation
                    navigate(`/lesson/doubts/${lesson.lessionId}`);
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold tracking-wide shadow-md hover:bg-blue-700 transition"
                >
                  View Doubts
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No lessons available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default Lessons;
