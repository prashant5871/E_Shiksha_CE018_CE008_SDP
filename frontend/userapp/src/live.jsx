// import './tem.css';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  Constants,
  usePubSub,
} from "@videosdk.live/react-sdk";
import Hls from "hls.js";
import { useLocation, useNavigate } from 'react-router-dom';
import { authToken, captureHLSThumbnail, createMeeting } from "./API";
import ReactPlayer from "react-player";
import { AuthContext } from "./shared/context/auth-context";
import Loading from "./shared/components/Loading";
import { toast } from "react-toastify";
// import FlyingEmojisOverlay from './FlyingEmojisOverlay';
let session;

function JoinScreen({ getMeetingAndToken, setMode }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async (mode) => {
    setMode(mode);
    await getMeetingAndToken(meetingId);
  };
  return (
    <div className="container">
      <button onClick={() => onClick("CONFERENCE")}>Create Meeting</button>
      <br />
      <br />
      {" or "}
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <br />
      <br />
      <button onClick={() => onClick("CONFERENCE")}>Join as Host</button>
      {" | "}
      <button onClick={() => onClick("VIEWER")}>Join as Viewer</button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    // <div key={props.participantId}>
    <div key={props.participantId} >
      <div className="relative w-full h-72 lg:h-4/5 rounded-lg overflow-hidden">
        <audio ref={micRef} autoPlay muted={isLocal} />
        {webcamOn && (
          <ReactPlayer
            //
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={videoStream}
            //
            height={"100%"}
            width={"100%"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        )}
      </div>
      <hr class="h-px mt-7 mb-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
    </div>
  );
}

function Controls(props) {
  const { leave, toggleMic, toggleWebcam, startHls, stopHls, hlsState, end } =
    useMeeting();
  const [hlsThumbnailImage, setHlsThumbnailImage] = useState(null);

  return (
    <>
      <div>
        {/* <div className="text-center py-4 space-y-4"> */}
        <button
          onClick={() => {
            const confirmEnd = window.confirm("Are you sure you want to end the live session?");
            if (confirmEnd) {
              end();
            }
          }}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          End Class
        </button>

        {/* </div> */}
        {/* &emsp;|&emsp; */}
        {/* <button onClick={() => toggleMic()}>toggleMic</button> */}
        {/* <button onClick={() => toggleWebcam()}>toggleWebcam</button> */}
        {/* &emsp;|&emsp; */}
        {/* <div className="text-center py-4 space-y-4"> */}
        <button
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          onClick={() => {
            startHls({
              layout: {
                type: "SPOTLIGHT",
                priority: "PIN",
                gridSize: "20",
              },
              theme: "DARK",
              mode: "video-and-audio",
              quality: "high",
              orientation: "landscape",
            });
          }}
        >
          Start Class
        </button>
        {/* </div> */}

        <button onClick={() => stopHls()} className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300">Pause</button>
        {(hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") && (
          <>
            &emsp;|&emsp;
            <button
              onClick={async () => {
                const { filePath, message } = await captureHLSThumbnail({
                  roomId: props.meetingId,
                });

                setHlsThumbnailImage({
                  imageLink: filePath,
                  message: message,
                });
              }}
            >
              Capture HLS Thumbnail
            </button>
          </>
        )}
      </div>
      {hlsThumbnailImage && hlsThumbnailImage?.imageLink ? (
        <>
          <p>Captured HLS Thumbnail</p>
          <img
            src={hlsThumbnailImage?.imageLink}
            alt={"capture_image"}
            height={200}
            width={300}
          />
        </>
      ) : (
        hlsThumbnailImage && (
          <>
            <p>Error In Capture HLS Thumbnail</p>
            <p>{hlsThumbnailImage?.message}</p>
          </>
        )
      )}
    </>
  );
}

function SpeakerView(props) {
  const { participants, hlsState, localParticipant } = useMeeting();
  const speakers = [...participants.values()].filter((participant) => {
    return participant.mode === Constants.modes.CONFERENCE;
  });

  const [previousParticipants, setPreviousParticipants] = useState(new Map());

  useEffect(() => {
    // Compare previous participants with current participants
    participants.forEach((participant, participantId) => {
      if (!previousParticipants.has(participantId) && participant.mode === Constants.modes.VIEWER) {
        // New viewer joined
        toast(`${participant.displayName} joined the class`);
      }
    });

    // Update the previous participants map
    setPreviousParticipants(new Map(participants));
  }, [participants]);




  return (
    // <div>
    <>
      <div className="flex-1 bg-indigo-100 rounded-lg shadow-lg mx-4 my-4 p-6 ">
        {/* <div className="relative w-full h-72 lg:h-4/5 rounded-lg overflow-hidden"> */}
        {speakers.map((participant) => (
          <ParticipantView participantId={participant.id} key={participant.id} />
        ))}
        {/* </div> */}

        <p>Current HLS State: {hlsState}</p>
        <Controls meetingId={props.meetingId} />
      </div>
      <div className="w-80 bg-white rounded-lg shadow-lg mx-4 my-4 p-6 flex flex-col space-y-2">
          <h2 className="capitalize text-2xl font-semibold text-gray-800">{session.topic}
            <small className="capitalize ms-3 text-sm text-gray-400 mt-1">
              ~by {session.course.teacher.user.firstName} {session.course.teacher.user.lastName}
            </small>
          </h2>

          <div className="space-y-1">
            <p className="text-lg text-gray-600">Course : <span className="font-semibold">Java Introduction Spring</span></p>
            <p className="text-lg text-gray-600">Duration :<span className="font-semibold"> {session.duration}min</span></p>
            <p className="text-lg text-gray-600">Number of Participant :<span className="font-semibold"> {participants.size -1}</span></p>
          </div>
         <ChatSection localParticipant={localParticipant}/>
        </div>
    </>
  );
}

function ViewerView() {
  // States to store downstream url and current HLS state
  const playerRef = useRef(null);
  const { hlsUrls, hlsState, leave, localParticipant } = useMeeting();
  const auth = useContext(AuthContext);
  useEffect(() => {
    if (hlsUrls.playbackHlsUrl && hlsState === "HLS_PLAYABLE") {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxLoadingDelay: 1, // max video loading delay used in automatic start level selection
          defaultAudioCodec: "mp4a.40.2", // default audio codec
          maxBufferLength: 0, // If buffer length is/become less than this value, a new fragment will be loaded
          maxMaxBufferLength: 1, // Hls.js will never exceed this value
          startLevel: 0, // Start playback at the lowest quality level
          startPosition: -1, // set -1 playback will start from intialtime = 0
          maxBufferHole: 0.001, // 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load.
          highBufferWatchdogPeriod: 0, // if media element is expected to play and if currentTime has not moved for more than highBufferWatchdogPeriod and if there are more than maxBufferHole seconds buffered upfront, hls.js will jump buffer gaps, or try to nudge playhead to recover playback.
          nudgeOffset: 0.05, // In case playback continues to stall after first playhead nudging, currentTime will be nudged evenmore following nudgeOffset to try to restore playback. media.currentTime += (nb nudge retry -1)*nudgeOffset
          nudgeMaxRetry: 1, // Max nb of nudge retries before hls.js raise a fatal BUFFER_STALLED_ERROR
          maxFragLookUpTolerance: 0.1, // This tolerance factor is used during fragment lookup.
          liveSyncDurationCount: 1, // if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist
          abrEwmaFastLive: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaSlowLive: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaFastVoD: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          abrEwmaSlowVoD: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          maxStarvationDelay: 1, // ABR algorithm will always try to choose a quality level that should avoid rebuffering
        });

        let player = document.querySelector("#hlsPlayer");

        hls.loadSource(hlsUrls.playbackHlsUrl);
        hls.attachMedia(player);
      } else {
        if (typeof playerRef.current?.play === "function") {
          playerRef.current.src = hlsUrls.playbackHlsUrl;
          playerRef.current.play();
        }
      }
    }
  }, [hlsUrls, hlsState]);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-gray-800 via-violet-900 to-gray-600">
        <div className="flex-1 bg-indigo-100 rounded-lg shadow-lg mx-4 my-4 p-6 overflow-hidden">
          {/* <div>
        <button
          onClick={() => {
            sendEmoji("confetti");
            publish("confetti");
          }}
        >
          Send 🎉 Reaction
        </button>

        <button
          onClick={() => {
            sendEmoji("clap");
            publish("clap");
          }}
        >
          Send 👏 Reaction
        </button>
      </div> */}
          {hlsState !== "HLS_PLAYABLE" ? (
            <div>
              <p>HLS has not started yet or is stopped</p>
            </div>
          ) : (
            hlsState === "HLS_PLAYABLE" && (
              <>
                <div className="relative w-full h-72 lg:h-4/5 rounded-lg overflow-hidden">
                  <video
                    ref={playerRef}
                    id="hlsPlayer"
                    autoPlay={true}
                    controls
                    style={{ width: "100%", height: "100%" }}
                    playsinline
                    playsInline
                    muted={true}
                    playing
                    onError={(err) => {
                      console.log(err, "hls video error");
                    }}
                  ></video>
                </div>
              </>
            )
          )}
          <button
            onClick={() => leave()}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >Exit</button>
        </div>

        <div className="w-80 bg-white rounded-lg shadow-lg mx-4 my-4 p-6 flex flex-col space-y-2">
          <h2 className="capitalize text-2xl font-semibold text-gray-800">{session.topic}
            <small className="capitalize ms-3 text-sm text-gray-400 mt-1">
              ~by {session.course.teacher.user.firstName} {session.course.teacher.user.lastName}
            </small>
          </h2>

          <div className="space-y-1">
            <p className="text-lg text-gray-600">Course : <span className="font-semibold">Java Introduction Spring</span></p>
            <p className="text-lg text-gray-600">Duration :<span className="font-semibold"> {session.duration}min</span></p>
          </div>
         <ChatSection localParticipant={localParticipant}/>
          
        </div>
      </div>

    </>
  );
}

function ChatSection({ localParticipant }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const pubsubData = usePubSub("CHAT", {
    onMessageReceived: (newMessage) => {
      handleReceiveMessage(newMessage);
    },
    onOldMessagesReceived: (oldMessages) => {
      setChatMessages(Array.isArray(oldMessages) ? oldMessages : []);
    },
  });

  const pubsubDataRef = useRef(pubsubData);
  useEffect(() => {
    pubsubDataRef.current = pubsubData;
  }, [pubsubData]);

  const handleReceiveMessage = useCallback((newMessage) => {
    setChatMessages((prev) => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      pubsubDataRef.current.publish(message, { persist: true });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col space-y-4 my-4 flex-grow overflow-hidden">
      {/* Chat Messages Display Section */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-start space-x-2"> <div className="bg-violet-200 text-blue-800 p-3 rounded-lg max-w-xs"> <p className="font-semibold">:)</p> <p className="text-sm">Hey! We're here to help you. Ask questions 🙂, no need to hesitate. </p> </div> </div>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              msg.senderId === localParticipant.id ? "justify-end" : ""
            }`}
          >
            <div
              className={`${
                msg.senderId === localParticipant.id
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
              } p-3 rounded-lg max-w-xs`}
            >
              <p className="font-semibold">{msg.senderName}:</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section for Sending Messages */}
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none m-1 focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}



function Container(props) {
  const [joined, setJoined] = useState(null);
  const { join, changeMode, leave } = useMeeting();
  const mMeeting = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    onParticipantModeChanged: (data) => {
      console.log("participantModeChanged", data)
    },
    onError: (error) => {
      alert(error.message);
    },
    onHlsStateChanged: (data) => {
      console.log("HLS State Changed", data);
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const mMeetingRef = useRef(mMeeting);
  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  const [joinLivestreamRequest, setJoinLivestreamRequest] = useState();

  usePubSub(`CHANGE_MODE_${mMeeting.localParticipant?.id}`, {
    onMessageReceived: (pubSubMessage) => {
      setJoinLivestreamRequest(pubSubMessage);
    },
  });

  console.log('meeting id' + props.meetingId);

  return (
    <>
      {/*<div className="container"> */}
      {/* <FlyingEmojisOverlay/> */}
      {/* <h3>Meeting Id: {props.meetingId}</h3> */}
      {joined && joined === "JOINED" ? (
        mMeeting.localParticipant.mode === Constants.modes.CONFERENCE ? (
          <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-gray-800 via-violet-900 to-gray-600">

            <SpeakerView meetingId={props.meetingId} />
          </div>
        ) : mMeeting.localParticipant.mode === Constants.modes.VIEWER ? (
          <>

            {/* {joinLivestreamRequest && (
              <div>
                {joinLivestreamRequest.senderName} requested you to join
                Livestream
                <button
                  onClick={() => {
                    changeMode(joinLivestreamRequest.message);
                    setJoinLivestreamRequest(null);
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    setJoinLivestreamRequest(null);
                  }}
                >
                  Reject
                </button>
              </div>
            )} */}
            <ViewerView />

          </>
        ) : null
      ) : joined && joined === "JOINING" ? (
        <Loading />
      ) : (
        // <button onClick={joinMeeting}>Join</button>
        // {!isTeacher && !classStarted && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-800">
          <div className="text-center py-8 px-6 space-y-6 bg-gray-800 rounded-lg shadow-lg">
            <p className="text-4xl font-extrabold text-white">Course Name</p>
            <p className="text-xl text-white/80">Instructor: Teachernam</p>

            {/* <!-- New Text Lines --> */}
            <p className="text-lg text-white/70">Session Topic: Introduction to Web Development</p>
            <p className="text-lg text-white/70">Duration: 2 hours</p>

            <button
              onClick={joinMeeting}
              className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
            >
              Join Class
            </button>
          </div>
        </div>

        // )}
      )}
      {/* </div> */}
    </>
  );
}

function App() {
  const location = useLocation();
  // const { session, type } = location.state;
  session = location.state?.session;
  const auth = useContext(AuthContext);


  const [meetingId, setMeetingId] = useState(session.meetingId);
  const [mode, setMode] = useState(location.state?.type);
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };
  const onMeetingLeave = () => {
    setMeetingId(null);
  };
  console.log(auth.userMail);
  // console.log('kinse'+auth.user)

  const navigate = useNavigate();
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: `${auth.userMail}`,
        mode: mode,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    navigate('/sessions')
  );
}

export default App;