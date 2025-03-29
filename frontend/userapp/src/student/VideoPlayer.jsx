import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (Hls.isSupported() && videoElement) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const qualities = hls.levels.map((level, index) => ({
          id: index,
          label: `${level.height}p`,
        }));
        setAvailableQualities([...qualities, { id: -1, label: "Auto" }]);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const quality = hls.levels[data.level]?.height || "Auto";
        setCurrentQuality(`${quality}p`);
      });

      hls.loadSource(`${src}/master.m3u8`);

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS Error:", data);
        if (data.fatal) hls.destroy();
      });

      // Initialize Plyr
      playerRef.current = new Plyr(videoElement);

      // Add Quality Button to Plyr Controls
      playerRef.current.on("ready", () => {
        const controlsContainer = document.querySelector(".plyr__controls");
        if (controlsContainer && !document.querySelector(".quality-button")) {
          const qualityButton = document.createElement("button");
          qualityButton.textContent = "Quality";
          qualityButton.className = "plyr__control quality-button";
          qualityButton.style.position = "relative";
          controlsContainer.appendChild(qualityButton);

          qualityButton.addEventListener("click", () => {
            setShowQualityMenu((prev) => !prev);
          });
        }
      });
    } else {
      console.error("HLS not supported");
    }

    return () => {
      if (playerRef.current) playerRef.current.destroy();
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [src]);

  const handleQualityChange = (qualityId) => {
    if (hlsRef.current) {
      if (qualityId === -1) {
        hlsRef.current.currentLevel = -1; // Auto
        setCurrentQuality("Auto");
      } else {
        hlsRef.current.currentLevel = qualityId;
        setCurrentQuality(`${hlsRef.current.levels[qualityId].height}p`);
      }
    }
    setShowQualityMenu(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        className="plyr__video-embed"
        controls
        style={{ width: "100%", aspectRatio: "16 / 9" }}
      />
      {showQualityMenu && (
        <div
          className="quality-menu"
          style={{
            position: "absolute",
            bottom: "60px",
            right: "10px",
            background: "white",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Choose Quality</h4>
          {availableQualities.map((quality) => (
            <button
              key={quality.id}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "5px",
                padding: "5px",
                border: "none",
                background: currentQuality === quality.label ? "#007bff" : "#f1f1f1",
                color: currentQuality === quality.label ? "white" : "black",
                borderRadius: "4px",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => handleQualityChange(quality.id)}
            >
              {quality.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
