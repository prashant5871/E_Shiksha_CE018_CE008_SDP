import React from 'react'
import { Link } from 'react-router-dom';

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

const EnrolledCourses = () => {
    
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-8 my-3">

        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="relative w-full sm:w-[48%] md:w-[30%] lg:w-[22%] max-w-sm rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer bg-white hover:shadow-2xl"
          >
        <Link to={`/course/${course.id}`}>


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
          </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnrolledCourses
