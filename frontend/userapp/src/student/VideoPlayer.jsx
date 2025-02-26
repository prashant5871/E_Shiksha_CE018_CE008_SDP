import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import toast from "react-hot-toast";
import { Settings, Check } from "lucide-react";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const qualityMenuRef = useRef(null);
  const settingsButtonRef = useRef(null);

  const [currentQuality, setCurrentQuality] = useState(null);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [isQualityMenuOpen, setQualityMenuOpen] = useState(false);

  const BASE_URL = src;

  useEffect(() => {
    const checkVideoElement = () => {
      const videoElement = videoRef.current;
      if (videoElement) {
        initializePlayer(videoElement);
      } else {
        requestAnimationFrame(checkVideoElement);
      }
    };

    const initializePlayer = (videoElement) => {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls();
        hlsRef.current = hls;

        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const qualities = hls.levels.map((level, index) => ({
            id: index,
            width: level.width,
            height: level.height,
            bitrate: level.bitrate,
          }));

          setAvailableQualities([...qualities, { id: -1, label: "Auto" }]);

          if (qualities.length > 0) {
            hls.currentLevel = -1;
            setCurrentQuality("Auto");
          }

          videoElement.play();
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          const switchedLevel = hls.levels[data.level];
          setCurrentQuality(
            switchedLevel ? `${switchedLevel.height}p` : "Auto"
          );
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS Error:", data);
          toast.error(`HLS Error: ${data.details || "Unknown error"}`);
          if (data.fatal) {
            hls.destroy();
          }
        });

        hls.loadSource(BASE_URL + "/master.m3u8");
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = BASE_URL + "/master.m3u8";
        videoElement.addEventListener("canplay", () => {
          videoElement.play();
        });
      } else {
        toast.error("Video format not supported");
      }
    };

    checkVideoElement();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [BASE_URL]);

  const handleQualityChange = (quality) => {
    if (hlsRef.current) {
      if (quality.id === -1) {
        hlsRef.current.nextLevel = -1;
      } else {
        hlsRef.current.nextLevel = quality.id;
      }
      setCurrentQuality(quality.label || `${quality.height}p`);
      setQualityMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        qualityMenuRef.current &&
        !qualityMenuRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setQualityMenuOpen(false);
      }
    };

    if (isQualityMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isQualityMenuOpen]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full relative">
        <div className="relative">
          <video
            ref={videoRef}
            className="rounded-lg shadow-md w-full"
            style={{ aspectRatio: "16 / 9" }}
            controls
            autoPlay
          />
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            ref={settingsButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setQualityMenuOpen(!isQualityMenuOpen);
            }}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <Settings size={16} />
          </button>
        </div>

        {isQualityMenuOpen && (
          <div
            ref={qualityMenuRef}
            className="absolute bottom-12 right-4 bg-black bg-opacity-80 text-white rounded-lg shadow-md p-3 w-40"
          >
            <h3 className="text-sm font-semibold mb-2">Quality</h3>
            <ul>
              {availableQualities.map((quality, index) => (
                <li
                  key={index}
                  onClick={() => handleQualityChange(quality)}
                  className={`cursor-pointer p-2 rounded-md flex justify-between items-center hover:bg-gray-700 ${
                    currentQuality === (quality.label || `${quality.height}p`)
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  {quality.label || `${quality.height}p`}
                  {currentQuality === (quality.label || `${quality.height}p`) && (
                    <Check size={16} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;