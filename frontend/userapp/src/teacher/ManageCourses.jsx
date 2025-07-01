import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/teacher/courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = () => navigate("/create");
  const handleUpdateCourse = (courseId) => navigate(`/update-course/${courseId}`);
  const handleAddLesson = (lessonId) => navigate(`/upload-lession/${lessonId}`);
  const handleViewLesson = (courseId) => navigate(`/lessons/${courseId}`);

  const toggleDescription = (courseId) => {
    setExpanded((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Manage Courses</h1>
      <button
        onClick={handleAddCourse}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 block mx-auto"
      >
        Add Course
      </button>

      {courses.length === 0 ? (
        <p className="text-center">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const words = course.description.split(" ");
            const isLongDescription = words.length > 20;
            const shortDescription = words.slice(0, 20).join(" ") + "...";

            return (
              <div
  key={course.courseId}
  className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col"
>
  {/* Course Thumbnail */}
  <img
    src={`http://localhost:8000/courses/thumbnail/${course.courseId}`}
    alt={course.courseName}
    className="w-full h-48 object-cover rounded-lg mt-3"
  />

  {/* Course Name */}
  <h2 className="text-xl font-semibold mt-3">{course.courseName}</h2>

  {/* Course Description */}
  <p className="text-gray-700 mt-2">
    {course.description.split(" ").length > 20 ? (
      expanded[course.courseId] ? (
        <>
          {course.description}{" "}
          <button
            onClick={() => toggleDescription(course.courseId)}
            className="text-red-500 hover:underline ml-1"
          >
            Show Less
          </button>
        </>
      ) : (
        <>
          {course.description.split(" ").slice(0, 20).join(" ")}...{" "}
          <button
            onClick={() => toggleDescription(course.courseId)}
            className="text-blue-500 hover:underline ml-1"
          >
            Read More
          </button>
        </>
      )
    ) : (
      course.description
    )}
  </p>

  {/* Course Details */}
  <p className="text-sm text-gray-600 mt-2">
    <strong>Price:</strong> ₹{course.price}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Category:</strong> {course.category ? course.category.categoryName : "N/A"}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Status:</strong> {course.status}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Duration:</strong> {course.duration} days
  </p>

  {/* Buttons (Always at the Bottom) */}
  <div className="mt-auto pt-4 flex flex-wrap gap-2">
    <button
      onClick={() => handleUpdateCourse(course.courseId)}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
    >
      Update Course
    </button>
    <button
      onClick={() => handleAddLesson(course.courseId)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
    >
      Add Lesson
    </button>
    <button
      onClick={() => handleViewLesson(course.courseId)}
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
    >
      View Lessons
    </button>
  </div>
</div>

            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
