export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyMTI0YmE1My1lYTJhLTRiNzAtOWMzYy1lMWQ3YmZiNjUzMWEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0MTI3OTkyOSwiZXhwIjoxNzQzODcxOTI5fQ.9k6XxJXlFTMhBj-fWcrLeeRq4EEd0rLWjwWnz2ohAmA";

// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};

export const captureHLSThumbnail = async ({ roomId }) => {
  const res = await fetch(`https://api.videosdk.live/v2/hls/capture`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId: roomId }),
  });

  const data = await res.json();
  return data;
};