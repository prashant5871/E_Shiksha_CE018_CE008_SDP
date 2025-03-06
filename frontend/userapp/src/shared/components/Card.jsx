import React from 'react'

const Card = ({ course,bookmarked }) => {
    return (
        <div>
            <div
                key={course.courseId}
                onClick={() => setSelectedCourse(course)}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl"
            >
                <div
                    className="absolute top-3 right-3 cursor-pointer text-gray-400 text-4xl"
                    title={bookmarked[course.courseId] ? "remove from bookmark" : "bookmark"}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkToggle(course.courseId);
                    }}
                >
                    {bookmarked[course.courseId] ? "❤️" : "🤍"}
                </div>

                <img
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`}
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
            </div>
        </div>
    )
}

export default Card
