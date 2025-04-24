import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ courseId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const hls = new Hls();
    const source = `http://localhost:8000/stream/${courseId}/master.m3u8`;

    if (Hls.isSupported()) {
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      video.src = source;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    return () => {
      hls.destroy();
    };
  }, [courseId]);

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h2>Streaming Course Video - ID {courseId}</h2>
      <video ref={videoRef} controls width="100%" style={{ borderRadius: "8px" }} />
    </div>
  );
};

export default VideoPlayer;
