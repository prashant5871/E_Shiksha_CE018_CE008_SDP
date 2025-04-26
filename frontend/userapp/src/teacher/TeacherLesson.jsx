import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../student/VideoPlayer";

const TeacherLesson = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLesson, setUpdatedLesson] = useState({ title: "", description: "", duration: "" });

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`http://localhost:8000/lessions/${lessonId}`);
        if (!response.ok) throw new Error("Failed to fetch lesson details.");
        const data = await response.json();
        setLesson(data);
        setUpdatedLesson({ title: data.title, description: data.description, duration: data.duration.replace("PT", "").toLowerCase() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setUpdatedLesson({ ...updatedLesson, [e.target.name]: e.target.value });
  };

  const handleUpdateLesson = async () => {
    try {
      const response = await fetch(`http://localhost:8000/lessions/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLesson),
      });

      if (!response.ok) throw new Error("Failed to update lesson.");

      const updatedData = await response.json();
      setLesson(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">Loading lesson...</div>;

  if (error)
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">{lesson.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition"
        >
          ⬅ Back to Course
        </button>
      </div>

      {/* Video Section */}
      <div className="bg-black p-5 rounded-xl shadow-lg overflow-hidden mb-6">
        <VideoPlayer src={`http://localhost:8000/lessions/stream/${courseId}/${lesson.lessionId}`} />
      </div>

      {/* Lesson Content / Edit Mode */}
      <div className="bg-white shadow-lg rounded-xl p-6 border">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lesson Details</h2>

            <p className="text-gray-700 mb-3">
              <span className="font-semibold text-blue-600">📖 Description:</span> {lesson.description}
            </p>

            <p className="text-gray-700 mb-3">
              <span className="font-semibold text-green-600">⏳ Duration:</span> {lesson.duration.replace("PT", "").toLowerCase()}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold text-red-600">📌 Status:</span> {lesson.status}
            </p>
           

            {/* Update Button */}
            <button
              onClick={handleEditClick}
              className="mt-4 px-5 py-2 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              ✏ Update Lesson
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Update Lesson</h2>

            <input
              type="text"
              name="title"
              value={updatedLesson.title}
              onChange={handleInputChange}
              placeholder="Lesson Title"
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <textarea
              name="description"
              value={updatedLesson.description}
              onChange={handleInputChange}
              placeholder="Lesson Description"
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="3"
            ></textarea>

            

            {/* Update Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-600 text-white text-lg rounded-lg shadow-lg hover:bg-gray-700 transition"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleUpdateLesson}
                className="px-5 py-2 bg-green-600 text-white text-lg rounded-lg shadow-lg hover:bg-green-700 transition"
              >
                ✅ Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherLesson;
