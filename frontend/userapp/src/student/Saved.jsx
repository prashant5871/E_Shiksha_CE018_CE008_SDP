import { useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";

const Saved = () => {
  const { user } = useContext(AuthContext);
  const [bookMarkedCourses, setBookMarkedCourses] = useState(
    user?.bookMarkedCourses || []
  );
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleRemoveBookmark = (courseId) => {
    setBookMarkedCourses(
      bookMarkedCourses.filter((course) => course.courseId !== courseId)
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Saved Courses
      </h2>

      <div className="space-y-4">
        {bookMarkedCourses?.map((course, index) => (
          <div
            key={course.courseId}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-md transition-shadow hover:shadow-xl"
          >
            {/* Clickable section to expand card */}
            <div
              className="px-6 py-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleToggle(index)}
            >
              <span className="font-semibold text-lg text-gray-800">
                {course.courseName}
              </span>
              <button className="text-gray-600 hover:text-gray-800 transition text-xl">
                {openIndex === index ? "▲" : "▼"}
              </button>
            </div>

            {openIndex === index && (
              <div className="p-6 bg-white">
                <p className="text-gray-700 mb-4">{course.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-600 font-semibold">
                      Duration: {course.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-800 font-semibold">
                      Price: {course.price} rupees
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm">
                      Instructor:{" "}
                      <span className="font-medium">
                        {course.teacher.user.firstName}
                      </span>
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemoveBookmark(course.courseId)}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Remove from Bookmark
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;
