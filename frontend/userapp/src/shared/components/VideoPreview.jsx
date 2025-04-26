import Hls from "hls.js";
import React, { useState, useEffect, useContext } from "react";



export const VideoPreview = ({ src }) => {
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover rounded-md"
      muted
      loop
      onMouseEnter={(e) => e.target.play()}
      onMouseLeave={(e) => {
        e.target.pause();
        e.target.currentTime = 0;
      }}
    ></video>
  );
};