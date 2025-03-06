import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const LiveMeeting = () => {
  const [meetingId, setMeetingId] = useState('');
  const [isHost, setIsHost] = useState(null); // null -> no role, true -> host, false -> viewer
  const [isMeetingCreated, setIsMeetingCreated] = useState(false);

  const handleCreateMeeting = () => {
    setIsMeetingCreated(true);
    setIsHost(true); // You will be the host of the meeting
  };

  const handleJoinMeeting = (role) => {
    if (meetingId.trim() === '') {
      alert('Please enter a Meeting ID');
      return;
    }
    setIsMeetingCreated(true);
    setIsHost(role === 'host');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Live Meeting</h2>

        <div className="mt-4 space-y-4">
          <input
            type="text"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Enter Meeting ID"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <button
            onClick={handleCreateMeeting}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Create Meeting
          </button>
          <button
            onClick={() => handleJoinMeeting('host')}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            Join as Host
          </button>
          <button
            onClick={() => handleJoinMeeting('viewer')}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Join as Viewer
          </button>
        </div>
      </div>

      {isMeetingCreated && (
        <div className="mt-12 w-full max-w-4xl rounded-lg shadow-xl bg-black">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=dQw4w9WgXcQ`} // Placeholder URL
            playing={true}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default LiveMeeting;
