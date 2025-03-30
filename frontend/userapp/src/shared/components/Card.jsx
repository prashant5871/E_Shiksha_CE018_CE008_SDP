import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Bookmark icons

const Card = ({ course, bookmarked, setSelectedCourse, setBookmarked, setUser, courses,toggleModal }) => {
    const { isStudent, isLoggedIn, user } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        console.log("isStudent = ", isStudent);
        console.log("isLoggedIn = ", isLoggedIn);
    }, []);

    const truncateDescription = (description, wordLimit) => {
        const words = description.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
    };

    const handleBookmarkToggle = async (courseId) => {
        try {
            if (!isLoggedIn) {
                // window.alert("Please login first...");
                toggleModal();
                return;
            }

            let userId = user?.user?.userId;

            setBookmarked((prev) => {
                let isBookmarked = prev && prev[courseId];
                const url = isBookmarked
                    ? `http://localhost:8000/courses/remove-bookmark/${courseId}/${userId}`
                    : `http://localhost:8000/courses/bookmark/${courseId}/${userId}`;
                const method = isBookmarked ? "DELETE" : "POST";

                sendRequest(url, method);

                if (user && user.bookMarkedCourses) {
                    if (isBookmarked) {
                        user.bookMarkedCourses = user.bookMarkedCourses.filter((c) => c?.courseId !== courseId);
                    } else {
                        user.bookMarkedCourses.push(courses.find((c) => c.courseId === courseId));
                    }
                    setUser(user);
                }

                return { ...prev, [courseId]: !isBookmarked };
            });
        } catch (error) {
            console.log(error);
        }
    };

    const truncatedDescription = truncateDescription(course.description, 15);

    return (
        <div
            key={course.courseId}
            onClick={() => setSelectedCourse(course)}
            className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl"
        >
            {/* Price Badge (Top-Left Corner) */}
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md">
                ₹{course.price}
            </div>

            {/* Bookmark & Status */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {!isStudent && isLoggedIn && (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                        ${course.status === "APPROVED" ? "bg-green-100 text-green-700" : ""}
                        ${course.status === "BLOCKED" ? "bg-red-100 text-red-700" : ""}
                        ${course.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
                        `}
                    >
                        {course.status}
                    </span>
                )}

                {/* Bookmark Icon */}
                {(isStudent || !isLoggedIn) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkToggle(course.courseId);
                        }}
                        title={bookmarked && bookmarked[course.courseId] ? "Remove from Bookmark" : "Bookmark"}
                    >
                        {bookmarked && bookmarked[course.courseId] ? (
                            <FaBookmark className="text-yellow-500 text-xl" />
                        ) : (
                            <FaRegBookmark className="text-gray-400 text-xl hover:text-yellow-500 transition duration-200" />
                        )}
                    </button>
                )}
            </div>

            {/* Course Image */}
            <img
                className="w-full h-48 object-cover rounded-t-xl"
                src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`}
                alt={course.courseName}
            />

            {/* Course Details */}
            <div className="p-6">
                <h2 className="font-bold text-xl text-gray-800">{course.courseName}</h2>
                <p className="text-gray-600 text-sm mt-2">
                    {truncatedDescription}
                    {course.description.split(" ").length > 15 && (
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(course);
                            }}
                        >
                            {" "}
                            Read More
                        </span>
                    )}
                </p>

                {/* Duration & Teacher Info */}
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-700 font-medium">
                        <strong>Duration:</strong> {course.duration} hours
                    </p>
                </div>
            </div>

            {/* Teacher Name (With Label) */}
            <div className="px-6 pb-4">
                <p className="text-sm font-medium text-gray-700">
                    <strong>Teacher:</strong> {course.teacher.user.firstName}
                </p>
            </div>
        </div>
    );
};

export default Card;
