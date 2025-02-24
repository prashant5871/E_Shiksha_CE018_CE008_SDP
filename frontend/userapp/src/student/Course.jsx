import React, { useState } from "react";
import { useParams } from "react-router-dom";

const courses = [
    {
        id: "1",
        title: "Mastering React: From Basics to Advanced",
        image: "https://th.bing.com/th/id/OIP.T1DOjvTFUtYyoLMLhenPWAHaEK?w=307&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        description:
            "A complete guide to mastering React.js, covering components, hooks, state management, and best practices.",
        instructor: "John Doe",
        duration: "6 Weeks",
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
                description: "This lesson covers the fundamentals of React and why it's a powerful UI library."
            },
            {
                title: "Understanding JSX",
                duration: "12:45",
                videoUrl: "https://www.youtube.com/embed/7fPXI_MnBOY",
                description: "Learn JSX syntax and how it simplifies UI development in React."
            },
        ],
        reviews: [
            { name: "Alice Johnson", rating: 5, comment: "This course was amazing! 🚀" },
            { name: "Mark Spencer", rating: 4, comment: "Great content but could use more examples." },
            { name: "Sophia Lee", rating: 5, comment: "Loved the detailed explanations! Highly recommend!" },
        ],
    },
];

export default function Course() {
    const { courseId } = useParams();
    const course = courses.find((course) => course.id === courseId);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [reviews, setReviews] = useState(course?.reviews || []);
    const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

    if (!course) {
        return (
            <div className="text-center text-2xl font-semibold mt-10 text-red-500">
                Course Not Found! 😢
            </div>
        );
    }

    // Handle Review Submission
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.name && newReview.comment) {
            setReviews([...reviews, newReview]);
            setNewReview({ name: "", rating: 5, comment: "" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex gap-6">
            {/* LEFT SECTION (Course Info + Lesson Video + Reviews) - Takes 70% Width */}
            <div className="w-[70%]">
                {/* Course Info (Always Visible) */}
                {!selectedLesson && <div className="bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-3xl font-semibold text-gray-800">{course.title}</h1>
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-lg mt-3" />
                    <p className="text-gray-600 mt-4">{course.description}</p>

                    <div className="mt-4">
                        <p><strong>Instructor:</strong> {course.instructor}</p>
                        <p><strong>Duration:</strong> {course.duration}</p>
                    </div>

                    {/* Topics */}
                    <h3 className="text-xl font-semibold mt-6">What You'll Learn:</h3>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                        {course.topics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                        ))}
                    </ul>

                    {/* Reviews Section */}
                <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Course Reviews</h2>

                    {/* Reviews List */}
                    <div className="mt-4 space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="border-b pb-3 mb-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 font-medium">{review.name}</span>
                                        <div className="text-yellow-500 text-lg">
                                            {"⭐".repeat(review.rating)} {/* Render stars dynamically */}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        )}
                    </div>

                    {/* Add New Review */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
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
                                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-md transition-all"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>

                </div>
                }


                {/* Lesson Video Section (Only if a lesson is selected) */}
                {selectedLesson && (
                    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                        <h2 className="text-2xl font-semibold text-gray-800">{selectedLesson.title}</h2>
                        <p className="text-gray-600 mt-2">{selectedLesson.description}</p>

                        {/* Video Player */}
                        <div className="mt-4">
                            <iframe
                                className="w-full h-64 sm:h-80 lg:h-96 rounded-lg"
                                src={selectedLesson.videoUrl}
                                title={selectedLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* "Back to Course Info" Button */}
                {selectedLesson && (
                    <button
                        onClick={() => setSelectedLesson(null)}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                    >
                        ⬅️ Back to Course Info
                    </button>
                )}

                
            </div>

            {/* RIGHT SECTION (Sticky Lessons List) */}
            <div className="w-[30%] bg-white p-4 rounded-xl shadow-md sticky top-4 h-[500px] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Lessons</h3>
                {course.lessons.map((lesson, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedLesson(lesson)}
                        className="cursor-pointer bg-gray-100 p-3 rounded-lg hover:bg-gray-200 mb-2"
                    >
                        {lesson.title} <span className="text-gray-500">({lesson.duration})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
