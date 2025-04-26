import React, { useEffect, useState, useContext } from "react";
import { FaSpinner } from "react-icons/fa"; // Loading spinner icon
import { useParams } from "react-router-dom"; // Get courseId from URL
import { AuthContext } from "../shared/context/auth-context";

const MyDoubts = () => {
  const { userId } = useContext(AuthContext); // Get logged-in userId
  const { courseId } = useParams(); // Get courseId from URL
  const [doubts, setDoubts] = useState([]);
  const [filteredDoubts, setFilteredDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "solved", "unsolved"
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const doubtsPerPage = 5;

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/doubts/${courseId}/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch doubts");
        }
        const data = await response.json();
        setDoubts(data);
        setFilteredDoubts(data); // Default: show all doubts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && courseId) {
      fetchDoubts();
    }
  }, [userId, courseId]);

  // Filter doubts based on selected filter
  useEffect(() => {
    if (filter === "all") {
      setFilteredDoubts(doubts);
    } else if (filter === "solved") {
      setFilteredDoubts(doubts.filter((doubt) => doubt.solution));
    } else if (filter === "unsolved") {
      setFilteredDoubts(doubts.filter((doubt) => !doubt.solution));
    }
    setCurrentPage(1); // Reset to first page on filter change
  }, [filter, doubts]);

  // Pagination logic
  const indexOfLastDoubt = currentPage * doubtsPerPage;
  const indexOfFirstDoubt = indexOfLastDoubt - doubtsPerPage;
  const currentDoubts = filteredDoubts.slice(indexOfFirstDoubt, indexOfLastDoubt);
  const totalPages = Math.ceil(filteredDoubts.length / doubtsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-8 flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Doubts</h2>

        {/* Filter Options */}
        <div className="flex justify-center space-x-4 mb-6">
          {["all", "solved", "unsolved"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
            </button>
          ))}
        </div>

        {/* Doubts List */}
        {filteredDoubts.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg font-medium">
              No {filter === "all" ? "" : filter} doubts found! 🤔
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentDoubts.map((doubt) => (
              <div key={doubt.doubtId} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Lesson: {doubt.lession.title}
                </h3>
                <p className="text-gray-700 mt-2 border-l-4 border-blue-500 pl-4">{doubt.doubt}</p>

                {/* Solution Section */}
                {doubt.solution ? (
                  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <p className="text-green-700 font-medium">Solution:</p>
                    <p className="text-gray-700">{doubt.solution}</p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-yellow-700 font-medium">No solution yet! 🕒</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyDoubts;
