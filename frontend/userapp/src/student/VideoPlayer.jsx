import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaChevronRight,
  FaVideo,
  FaTachometerAlt,
  FaChevronLeft,
  FaCheck,
} from "react-icons/fa";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const MAX_RETRIES = 3;

  const destroyInstances = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const resetVideo = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.pause();
    videoElement.removeAttribute("src");
    videoElement.load();
  };

  const loadVideo = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    setError(false);
    destroyInstances();
    resetVideo();

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(videoElement);
      hls.loadSource(`${src}/master.m3u8`);

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

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS Error:", data);
        if (data.fatal) {
          if (retryCount < MAX_RETRIES) {
            console.warn(`Retrying video load... Attempt ${retryCount + 1}`);
            setRetryCount((prev) => prev + 1);
            loadVideo();
          } else {
            console.error("Max retries reached. Video failed to load.");
            setError(true);
          }
        }
      });

      videoElement.addEventListener("seeked", () => {
        if (isPlaying) {
          videoElement.play();
        }
      });
    } else {
      console.error("HLS not supported");
      setError(true);
    }
  };

  useEffect(() => {
    setRetryCount(0);
    loadVideo();

    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      destroyInstances();
    };
  }, [src]);

  const handleQualityChange = (qualityId) => {
    if (hlsRef.current) {
      if (qualityId === -1) {
        hlsRef.current.currentLevel = -1;
        setCurrentQuality("Auto");
      } else {
        hlsRef.current.currentLevel = qualityId;
        setCurrentQuality(`${hlsRef.current.levels[qualityId].height}p`);
        if (isPlaying) {
          const videoElement = videoRef.current;
          videoElement.pause();
          hlsRef.current.once(Hls.Events.BUFFER_APPENDED, () => {
            if(videoElement.paused){
              videoElement.play();
            }
          });
        }
      }
    }
    setShowQualityModal(false);
    setShowSettingsModal(false);
  };

  const handlePlaybackRateChange = (rate) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSpeedModal(false);
    setShowSettingsModal(false);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (video) {
      const newTime = (parseFloat(e.target.value) / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (video) {
      video.volume = parseFloat(e.target.value);
      setVolume(parseFloat(e.target.value));
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setShowSettingsModal((prev) => !prev);
  };

  const handleVideoClick = () => {
    if (showSettingsModal) {
      setShowSettingsModal(false);
      setShowQualityModal(false);
      setShowSpeedModal(false);
    } else {
      togglePlay(); // Restore the video screen toggle
    }
  };

  const handleVideoDoubleClick = () => {
    toggleFullscreen(new Event('click'));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const qualityLabel =
    availableQualities.find((q) => q.label === currentQuality)?.label ||
    currentQuality;

  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
      onDoubleClick={handleVideoDoubleClick}
    >
      {error ? (
        <div>❌ Failed to load video. Please refresh or try again later.</div>
      ) : (
        <>
          <video ref={videoRef} style={{ width: "100%", aspectRatio: "16 / 9" }} />
          {showControls && (
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                background: "#3d3e40",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                color: "white",
              }}
            >
              <button
                onClick={togglePlay}
                style={{ background: "none", border: "none", color: "white", fontSize: "1.2em", cursor: "pointer" }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, margin: '0 10px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  style={{ flex: 1 }}
                />
                <span style={{ marginLeft: '8px' }}>{formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}</span>
              </div>
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                style={{ background: "none", border: "none", color: "white", fontSize: "1.2em", cursor: "pointer" }}
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{ width: "80px", margin: "0 10px" }}
              />
              <div style={{ position: "relative", margin: "0 10px" }}>
                <button
                  onClick={handleSettingsClick}
                  style={{ background: "none", border: "none", color: "white", fontSize: "1.2em", cursor: "pointer" }}
                >
                  <FaCog />
                </button>
                {showSettingsModal && (
                  <div
                    className="quality-menu"
                    style={{
                      position: "absolute",
                      bottom: "125%",
                      right: "0",
                      background: "white",
                      color: "black",
                      padding: "10px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                      zIndex: 1000,
                    }}
                  >
                    <button
                      onClick={(e) => {e.stopPropagation(); setShowQualityModal(true);}}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "200px",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaVideo style={{ marginRight: "8px" }} />
                        Quality
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {qualityLabel}
                        <FaChevronRight style={{ marginLeft: "8px" }} />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {e.stopPropagation(); setShowSpeedModal(true);}}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "200px",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaTachometerAlt style={{ marginRight: "8px" }} />
                        Playback speed
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {playbackRate}x
                        <FaChevronRight style={{ marginLeft: "8px" }} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={toggleFullscreen}
                style={{ background: "none", border: "none", color: "white", fontSize: "1.2em", cursor: "pointer" }}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          )}
          {(showQualityModal || showSpeedModal) && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1001,
              }}
            >
              <div
                className="modal"
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  zIndex: 1002,
                }}
              >
                {showQualityModal && (
                  <>
                    <div
                      style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}
                      onClick={() => setShowQualityModal(false)}
                    >
                      <FaChevronLeft style={{ marginRight: "8px" }} />
                      Quality
                    </div>
                    {availableQualities.map((quality) => (
                      <button
                        key={quality.id}
                        onClick={() => handleQualityChange(quality.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          padding: "8px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        {quality.label} {currentQuality === quality.label && <FaCheck style={{ marginLeft: "8px" }} />}
                      </button>
                    ))}
                  </>
                )}
                {showSpeedModal && (
                  <>
                    <div
                      style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}
                      onClick={() => setShowSpeedModal(false)}
                    >
                      <FaChevronLeft style={{ marginRight: "8px" }} />
                      Playback speed
                    </div>
                    <button
                      onClick={() => handlePlaybackRateChange(0.5)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      0.5x {playbackRate === 0.5 && <FaCheck style={{ marginLeft: "8px" }} />}
                    </button>
                    <button
                      onClick={() => handlePlaybackRateChange(1)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      1x {playbackRate === 1 && <FaCheck style={{ marginLeft: "8px" }} />}
                    </button>
                    <button
                      onClick={() => handlePlaybackRateChange(1.5)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      1.5x {playbackRate === 1.5 && <FaCheck style={{ marginLeft: "8px" }} />}
                    </button>
                    <button
                      onClick={() => handlePlaybackRateChange(2)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      2x {playbackRate === 2 && <FaCheck style={{ marginLeft: "8px" }} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VideoPlayer;