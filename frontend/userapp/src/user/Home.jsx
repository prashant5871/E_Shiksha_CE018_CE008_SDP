import { useState } from "react";

// Sample Course Data
const courses = [
  {
    id: "1",
    title: "Mastering React: From Basics to Advanced",
    image: "https://th.bing.com/th/id/OIP.T1DOjvTFUtYyoLMLhenPWAHaEK?w=307&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    description:
      "A complete guide to mastering React.js, covering components, hooks, state management, and best practices.",
    instructor: "John Doe",
    duration: "20 days",
    price: 2000,
    topics: [
      "React Basics & JSX",
      "State & Props",
      "Hooks (useState, useEffect, useContext)",
      "React Router & Navigation",
      "Redux & State Management",
      "Building Real-World Projects",
    ],
    lessons: [
      {
        title: "Introduction to React",
        duration: "10:30",
        videoUrl: "https://www.youtube.com/embed/N3AkSS5hXMA",
        description: "This lesson covers the fundamentals of React and why it's a powerful UI library.",
      },
    ],
    reviews: [
      { name: "Alice Johnson", rating: 5, comment: "This course was amazing! 🚀" },
      { name: "Mark Spencer", rating: 4, comment: "Great content but could use more examples." },
    ],
  },
];

export default function CourseList() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookmarked, setBookmarked] = useState({}); // To store bookmarked state for each course

  const handleBookmarkToggle = (courseId) => {
    setBookmarked((prev) => ({
      ...prev,
      [courseId]: !prev[courseId], // Toggle bookmark state
    }));
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setSelectedCourse(null);
    }
  };

  return (
    <div className="p-6">
      {/* 🌟 Welcome Section with Two Parts */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between shadow-lg mb-6">
        {/* Left Side: Welcome Text */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Welcome to <span className="text-yellow-300">eShiksha</span> 🚀
          </h1>
          <p className="text-lg md:text-xl mt-4">
            Unlock your potential with world-class courses taught by industry experts.
            Whether you're a beginner or an experienced developer, we have something for everyone.
            Start learning today and take your skills to the next level!
          </p>
          <button className="mt-6 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition">
            Explore Courses →
          </button>
        </div>

        {/* Right Side: Welcome Image */}
        <div className="mt-6 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src="https://cdn.leverageedu.com/blog/wp-content/uploads/2020/03/24185535/Online-Learning.png"
            className="w-full max-w-sm rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Course Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="relative w-full sm:w-[48%] md:w-[30%] lg:w-[22%] max-w-sm rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer bg-white hover:shadow-2xl"
          >
            {/* Heart Icon for Bookmarking */}
            <div
              className="absolute top-3 right-3 cursor-pointer text-gray-400 text-2xl"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening when clicking the heart
                handleBookmarkToggle(course.id);
              }}
            >
              {bookmarked[course.id] ? "❤️" : "🤍"} {/* Toggle between filled and unfilled heart */}
            </div>

            <img className="w-full h-48 object-cover rounded-t-xl" src={course.image} alt={course.title} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl text-gray-800">{course.title}</div>
              <p className="text-gray-600 text-sm mt-2">{course.description}</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">{course.duration}</p>
              <p className="text-lg font-semibold text-green-800 mt-2">{course.price} rupees</p>
            </div>
            <div className="px-6 pt-2 pb-4 flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {course.instructor}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable Course Modal */}
      {selectedCourse && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h2>
            <p className="text-gray-600 mt-2">{selectedCourse.description}</p>
            <p className="text-gray-800 font-semibold mt-2">Instructor: {selectedCourse.instructor}</p>
            <p className="text-gray-800 font-semibold mt-2">Duration: {selectedCourse.duration}</p>

            {/* Topics */}
            <h3 className="text-lg font-bold mt-4 text-gray-700">What You Will Learn:</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {selectedCourse.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>

            {/* Demo Video */}
            <h3 className="text-lg font-bold mt-4 text-gray-700">Demo Video:</h3>
            <div className="mt-2">
              <iframe
                className="w-full h-60 rounded-md"
                src={selectedCourse.lessons[0].videoUrl}
                title="Demo Video"
                allowFullScreen
              ></iframe>
            </div>

            {/* Reviews */}
            <h3 className="text-lg font-bold mt-4 text-gray-700">Student Reviews:</h3>
            <div className="mt-2 space-y-2">
              {selectedCourse.reviews.map((review, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <p className="font-semibold">{review.name} ⭐ {review.rating}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
