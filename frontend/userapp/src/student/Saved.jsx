import { useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import CourseDetail from "../shared/components/CourseDetail";
import { motion, AnimatePresence } from "framer-motion";

const Saved = ({ toggleModal }) => {
  const { user, setUser } = useContext(AuthContext);
  const [bookMarkedCourses, setBookMarkedCourses] = useState(
    user?.bookMarkedCourses || []
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { sendRequest } = useHttpClient();
  const [openDetail, setOpenDetail] = useState(false);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleRemoveBookmark = (courseId) => {
    const userId = user?.user.userId;
    const url = `http://localhost:8000/courses/remove-bookmark/${courseId}/${userId}`;
    
    sendRequest(url, "DELETE");
    
    setBookMarkedCourses((prevCourses) =>
      prevCourses.filter((course) => course.courseId !== courseId)
    );

    user.bookMarkedCourses = user.bookMarkedCourses.filter(
      (course) => course.courseId !== courseId
    );
    setUser({ ...user });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen flex flex-col justify-start items-center pt-12 pb-24 px-6 bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Title */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          My Saved Courses
        </h2>
      </div>

      {/* No Courses Message */}
      {bookMarkedCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
        >
          <p className="text-gray-700 text-lg font-medium">
            You haven't bookmarked any courses yet! 📚
          </p>
          <p className="text-gray-500 mt-2">Explore courses and save your favorites.</p>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <AnimatePresence>
            {bookMarkedCourses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"
              >
                {/* Course Header */}
                <motion.div
                  className="px-6 py-4 bg-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleToggle(index)}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-semibold text-lg text-gray-800">
                    {course?.courseName}
                  </span>
                  <span className="text-gray-600">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </motion.div>

                {/* Course Details */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 bg-white"
                    >
                      <p className="text-gray-700 mb-4">{course?.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <span className="text-blue-600 font-semibold mr-2">
                            Duration:
                          </span>
                          <span>{course?.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-800 font-semibold mr-2">
                            Price:
                          </span>
                          <span>{course?.price} rupees</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-800 font-semibold mr-2">
                            Instructor:
                          </span>
                          <span>{course?.teacher?.user?.firstName}</span>
                        </div>
                        <div className="flex items-center mt-4">
                          <motion.button
                            onClick={() => handleRemoveBookmark(course?.courseId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mr-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Remove
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setSelectedCourse(course);
                              setOpenDetail(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View More
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetail
          toggleModal={toggleModal}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          isOpen={openDetail}
          setIsOpen={setOpenDetail}
        />
      )}
    </motion.div>
  );
};

export default Saved;
