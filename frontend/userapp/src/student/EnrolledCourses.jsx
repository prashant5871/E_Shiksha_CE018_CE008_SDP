import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8000/student/get-course/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }
        const data = await response.json();
        setEnrolledCourses(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : description;
  };

  if (loading) {
    return <div className="text-center text-xl font-bold p-6">Loading enrolled courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-6">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Enrolled Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {enrolledCourses.map((course) => (
          <Link
            key={course.courseId}
            to={`/course/${course.courseId}`}
            className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl relative flex flex-col h-full"
          >
            {/* Price Label at Top Left */}
            <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-md font-bold text-sm flex items-center">
              ₹ {course.price}
            </div>

            {/* Course Image */}
            <img
              className="w-full h-48 object-cover rounded-t-xl"
              // src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`}
              src={`http://localhost:8000/courses/thumbnail/${course.courseId}`}
              alt={course.courseName}
            />

            {/* Course Details - flex-grow ensures the button stays at the bottom */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="font-bold text-xl text-gray-800">{course.courseName}</div>
              <p className="text-gray-600 text-sm mt-2 flex-grow">{truncateDescription(course.description, 15)}</p>

              {/* Author and Duration Labels */}
              <div className="mt-3 flex justify-between items-center">
                <span className="text-blue-700 font-semibold text-sm">By {course.teacher.user.firstName}</span>
                <span className="text-gray-700 font-medium text-sm">{course.duration} hours</span>
              </div>

              {/* "My Doubts" Button - Always at the Bottom */}
              <div className="mt-4">
                <Link
                  to={`/doubts/${course.courseId}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-md font-semibold transition duration-300 hover:bg-blue-700"
                  onClick={(e) => e.stopPropagation()} // Prevents parent <Link> navigation
                >
                  My Doubts
                </Link>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
