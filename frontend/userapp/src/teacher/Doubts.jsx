import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Doubts = () => {
  const { lessonId } = useParams();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [newSolution, setNewSolution] = useState("");

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/lessions/doubts/${lessonId}`);
        if (!response.ok) throw new Error("Failed to fetch doubts.");
        const data = await response.json();
        setDoubts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, [lessonId]);

  const handleEdit = (doubt) => {
    setEditingDoubt(doubt);
    setNewSolution(doubt.solution || ""); // Pre-fill with existing solution
  };

  const handleSaveSolution = async (doubtId) => {
    try {
      const response = await fetch(`http://localhost:8000/doubts/solution/${doubtId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solution: newSolution }),
      });

      if (!response.ok) throw new Error("Failed to update solution.");

      setDoubts((prevDoubts) =>
        prevDoubts.map((doubt) =>
          doubt.doubtId === doubtId ? { ...doubt, solution: newSolution } : doubt
        )
      );

      setEditingDoubt(null);
      setNewSolution("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading doubts...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Lesson Doubts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doubts.length > 0 ? (
          doubts.map((doubt) => (
            <div
              key={doubt.doubtId}
              className="bg-white shadow-lg rounded-lg p-6 border transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col"
            >
              {/* Doubt Text */}
              <p className="text-gray-800 text-lg font-semibold mb-3">❓ {doubt.doubt}</p>

              {/* Solution Section */}
              {editingDoubt?.doubtId === doubt.doubtId ? (
                <div>
                  <textarea
                    className="w-full p-2 border rounded-lg text-gray-800"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    rows="3"
                  />
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingDoubt(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveSolution(doubt.doubtId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-600">💡 Solution:</span>{" "}
                    {doubt.solution ? doubt.solution : "No solution provided yet."}
                  </p>

                  {/* Edit Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleEdit(doubt)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {doubt.solution ? "Edit Solution" : "Add Solution"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No doubts available.</p>
        )}
      </div>
    </div>
  );
};

export default Doubts;
