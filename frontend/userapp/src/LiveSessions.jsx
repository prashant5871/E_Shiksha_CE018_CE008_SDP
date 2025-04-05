import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loading from "./shared/components/Loading";
import { AuthContext } from "./shared/context/auth-context";
import { useHttpClient } from "./shared/hooks/http-hook";

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [showLiveDialog, setShowLiveDialog] = useState(false); // Manage dialog visibility
  const [liveDetails, setliveDetails] = useState(null); // Store form values
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest, clearError } = useHttpClient();

  const fetchSession = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/live/${auth.isStudent ? "student" : "teacher"}/${auth.userId}`,
        "GET",
        null,
        {
          'Authorization': `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        }
      );
      setSessions(responseData.data);
    } catch { }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const navigate = useNavigate();
  const handleStart = (session) => {
    navigate('/live', { state: { session, type: auth.isStudent ? "VIEWER" : "CONFERENCE" } });
  }

  const handleUpdate = (session) => {
    setliveDetails(session);
    setShowLiveDialog(true); // Open the dialog
  }

  const submitUpdate = async (id) => {
    // Submit updated live session data
    try {
      const response = await sendRequest(
        `http://localhost:8000/live/${id}`, // Use the correct API endpoint for update
        'PUT',
        JSON.stringify({
          liveClassId: id,
          scheduledTime: liveDetails.scheduledTime,
          meetingId: liveDetails.meetingId,
          topic: liveDetails.topic,
          duration: liveDetails.duration,
          course: liveDetails.course.courseId
        }),
        {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        }
      );
      setShowLiveDialog(false); // Close dialog after successful submission
      fetchSession(); // Re-fetch the sessions to reflect the updated data
    } catch (error) {
      console.error("Failed to update live session:", error);
    }
  }

  const handleDelete = async (sessionId) => {
    // Show confirmation alert
    const confirmDelete = window.confirm("Are you sure you want to cancel this live session?");

    if (confirmDelete) {
      try {
        // Make API request to delete the session
        await sendRequest(
          `http://localhost:8000/live/${sessionId}`,
          'DELETE',
          null,
          {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          }
        );

        fetchSession();
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    } else {
      // If the user cancels, do nothing (just return)
      return;
    }
  };



  const formatDateForInput = (date) => {
    // Convert to local time and format as YYYY-MM-DDTHH:mm
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = ("0" + (localDate.getMonth() + 1)).slice(-2); // Month is 0-indexed
    const day = ("0" + localDate.getDate()).slice(-2);
    const hours = ("0" + localDate.getHours()).slice(-2);
    const minutes = ("0" + localDate.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
        {sessions.map((session) => (
          <div
            key={session.liveClassId}
            className="relative flex items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:translate-y-2"
          >
            {/* X Button for Delete */}
            <button
              onClick={() => handleDelete(session.liveClassId)} // Implement handleDelete to handle deletion logic
              className="absolute top-0 left-2 text-white text-4xl  hover:text-red-500"
            >
              ×
            </button>

            {/* Left Part: Course Name, Topic, and Teacher's Name */}
            <div className="flex flex-col text-center flex-grow">
              <h3 className="text-2xl font-bold">{session.topic}</h3>
              <div className="text-xl italic mt-2">
                {session.course.courseName}
                <small className="text-sm text-gray-200 mt-1">
                  ({session.course.teacher.user.firstName} {session.course.teacher.user.lastName})
                </small>
              </div>
            </div>

            {/* Vertical Line */}
            <div className="border-l-2 border-white mx-6 h-20"></div>

            {/* Middle Part: Duration */}
            <div className="flex flex-col items-center gap-4 text-xl">
              <p>Duration</p>
              <p className="text-sm">{session.duration} minutes</p>
            </div>

            {/* Vertical Line */}
            <div className="border-l-2 border-white mx-6 h-20"></div>

            {/* Right Part: Scheduled Time and Buttons */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg">
                Time : {new Date(session.scheduledTime).toLocaleString()} {/* Format date in dd/mm/yyyy */}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => { handleStart(session) }}
                  className="bg-white text-blue-500 px-6 py-2 rounded-md text-lg transition-all duration-300 hover:bg-blue-500 hover:text-white"
                >
                  Start
                </button>
                {!auth.isStudent ? (
                  <button
                    onClick={() => handleUpdate(session)}
                    className="bg-yellow-300 text-yellow-700 px-6 py-2 rounded-md text-lg transition-all duration-300 hover:bg-yellow-700 hover:text-white"
                  >
                    Update
                  </button>
                ) : ''}
              </div>
            </div>
          </div>
        ))}
      </div>





      {/* Update Live Session Dialog */}
      {showLiveDialog && (
        <div className="fixed backdrop-blur-sm inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold">Update Live Session</h2>
            <p className="text-sm mb-4">{liveDetails.course.courseName}</p>
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={liveDetails.topic}
                onChange={(e) => setliveDetails({ ...liveDetails, topic: e.target.value })}
              />
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={liveDetails.duration}
                onChange={(e) => setliveDetails({ ...liveDetails, duration: e.target.value })}
              />
              <label className="block text-sm font-medium mb-2">Scheduled Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formatDateForInput(liveDetails.scheduledTime)} // Corrected value format
                onChange={(e) => setliveDetails({ ...liveDetails, scheduledTime: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLiveDialog(false)} // Close dialog on cancel
                className="mr-4 py-2 px-4 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => submitUpdate(liveDetails.liveClassId)} // Submit live session details
                className="py-2 px-4 bg-blue-600 text-white rounded text-sm"
              >
                Update Live Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveSessions;
