import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext); // Get userId from context

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
        console.log("data : ",data);
        setEnrolledCourses(data || []); // Access enrolledCourses array
        setLoading(false);
      } catch (err) {
        console.log("Error : ",err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

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
          <div
            key={course.courseId}
            className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl"
          >
            <Link to={`/course/${course.courseId}`} className="block h-full">
              <img
                className="w-full h-48 object-cover rounded-t-xl"
                src={`http://localhost:8000/images/thumbnails/${(course.thumbnail)}`} // Assuming you have a thumbnail URL
                alt={course.courseName}
              />
              <div className="p-6">
                <div className="font-bold text-xl text-gray-800">{course.courseName}</div>
                <p className="text-gray-600 text-sm mt-2">{course.description}</p>
                <p className="text-lg font-semibold text-blue-600 mt-2">{course.duration}</p>
                <p className="text-lg font-semibold text-green-800 mt-2">{course.price} rupees</p>
              </div>
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {course.teacher.user.firstName}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;