import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';

const Card = ({ course, bookmarked, setSelectedCourse,setBookmarked,setUser,courses }) => {
    const { isStudent,isLoggedIn,user } = useContext(AuthContext);
  const { isLoading, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    console.log("isStudent = ",isStudent);
    console.log("isLoggedIn = ",isLoggedIn);
  }, [])
  


    const truncateDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    };

    const handleBookmarkToggle = async (courseId) => {
        try {
          console.log("user in toggle : ", user);
          let userId = user?.user.userId;
          if (!isLoggedIn) {
            window.alert("Please login first...");
            return;
          }
          setBookmarked((prev) => {
            let isBookmarked = false;
            if(prev && prev[courseId])
            {
                isBookmarked = true;
            }
            const url = isBookmarked
              ? `http://localhost:8000/courses/remove-bookmark/${courseId}/${userId}`
              : `http://localhost:8000/courses/bookmark/${courseId}/${userId}`;
    
            const method = isBookmarked ? "DELETE" : "POST";
    
            sendRequest(url, method);
    
    
            if (user && user.bookMarkedCourses && isBookmarked) {
              user.bookMarkedCourses = user.bookMarkedCourses.filter(c => c?.courseId != courseId);
              setUser(user);
            }else if(user && user.bookMarkedCourses){
                user?.bookMarkedCourses?.push(courses.find(course => course.courseId == courseId));
                setUser(user);
            }
    
            return {
              ...prev,
              [courseId]: !isBookmarked,
            };
          });
        } catch (error) {
          console.log(error);
        }
      };

    const truncatedDescription = truncateDescription(course.description, 15);

    return (
        <div>
            <div
                key={course.courseId}
                onClick={() => setSelectedCourse(course)}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl"
            >
                <div
                    className="absolute top-3 right-3 cursor-pointer text-2xl bg-amber-50"
                    title={(bookmarked && bookmarked[course.courseId] )? "remove from bookmark" : "bookmark"}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkToggle(course.courseId);
                    }}
                >
                    {!isStudent && isLoggedIn && (
                        <span
                            className={
                                course.status === "APPROVED"
                                    ? "text-green-600"
                                    : course.status === "BLOCKED"
                                        ? "text-red-600"
                                        : course.status === "PENDING"
                                            ? "text-yellow-600"
                                            : "text-gray-600" // Default color if status is something else
                            }
                        >
                            {course.status}
                        </span>
                    )}
                    {(isStudent || !isLoggedIn) && (bookmarked && bookmarked[course.courseId] ? "❤️" : "🤍")}
                </div>

                <img
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={`http://localhost:8000/images/thumbnails/${encodeURIComponent(course.thumbnail)}`}
                    alt={course.courseName}
                />
                <div className="p-6">
                    <div className="font-bold text-xl text-gray-800">{course.courseName}</div>
                    <p className="text-gray-600 text-sm mt-2">
                        {truncatedDescription}
                        {course.description.split(' ').length > 15 && (
                            <span className="text-blue-500 cursor-pointer" onClick={(e) => {e.stopPropagation();setSelectedCourse(course)}}> Read More</span>
                        )}
                    </p>
                    <p className="text-lg font-semibold text-blue-600 mt-2">{course.duration} hours</p>
                    <p className="text-lg font-semibold text-green-800 mt-2">{course.price} rupees</p>
                </div>
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {course.teacher.user.firstName}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Card;