import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useMusicUtility from "../../utils/music/useMusicUtility";
import MusicContext from "../../context/music/MusicContext";

const MusicPlayer = () => {
  const {
    currentTrack,
    topTracks,
    isAudioLoading,
    setIsAudioLoading,
    isSpeechModalOpen,
    contentQuality,
    isNetworkConnected,
  } = useContext(MusicContext);
  const { getTrack } = useMusicUtility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [nextTrackId, setNextTrackId] = useState(null);

  const progressBarRef = useRef(null);
  const audioRef = useRef(new Audio());
  const saavnApiBaseUrl = "https://saavn.dev/api";

  const {
    id: currentTrackId,
    image: currentTrackImage,
    name: currentTrackName,
    album: currentTrackAlbum,
    artists: currentTrackArtists,
    link: currentTrackLink,
  } = currentTrack;

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleNextTrack = useCallback(async () => {
    try {
      const audio = audioRef.current;
      audio.pause();
      setIsPlaying(false);
      setIsAudioLoading(true);

      let trackIdToFetch;
      if (isNetworkConnected) {
        trackIdToFetch = await getSuggestedTrackId();
      } else {
        const trackIds = Object.keys(topTracks);
        trackIdToFetch = trackIds[Math.floor(Math.random() * trackIds.length)];
      }

      await getTrack(trackIdToFetch);
      setIsAudioLoading(false);
    } catch (error) {
      console.error("Error handling next track:", error);
      setIsAudioLoading(false);
    }
  }, [getTrack, isNetworkConnected, topTracks]);

  const getSuggestedTrackId = async () => {
    const { data } = await axios.get(
      `${saavnApiBaseUrl}/songs/${currentTrackId}/suggestions`,
      { params: { limit: 10 } },
    );
    const suggestedTrackId = data.data[Math.floor(Math.random() * 10)].id;
    return suggestedTrackId;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const newPosition = (audio.currentTime / audio.duration) * 100;
        setProgress(newPosition);
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleNextTrack, isDragging]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isSpeechModalOpen) {
      audio.pause();
      setIsPlaying(false);
    }
    return () => {
      audio.play();
      setIsPlaying(true);
    };
  }, [isSpeechModalOpen]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!Capacitor.isNativePlatform()) {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: currentTrackName,
          artist: currentTrackArtists,
          album: currentTrackAlbum,
          artwork: [
            {
              src: currentTrackImage,
              sizes:
                contentQuality === "low"
                  ? "50x50"
                  : contentQuality === "normal"
                    ? "150x150"
                    : contentQuality === "high"
                      ? "500x500"
                      : "150x150",
              type: "image/jpg",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", handleTogglePlay);

        navigator.mediaSession.setActionHandler("pause", handleTogglePlay);

        navigator.mediaSession.setActionHandler("nexttrack", handleNextTrack);

        navigator.mediaSession.setActionHandler("stop", () => {
          audio.pause();
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackId, handleTogglePlay]);

  useEffect(() => {
    const playAudio = async () => {
      if (currentTrackLink) {
        try {
          const audio = audioRef.current;
          audio.src = currentTrackLink;
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        }
      }
    };

    playAudio();
  }, [currentTrackLink]);

  const handleProgressBarClick = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    const newPosition = (e.nativeEvent.offsetX / progressBar.clientWidth) * 100;
    setProgress(newPosition);
    audio.currentTime = (newPosition / 100) * audio.duration;
  };

  const handleProgressBarMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressBarMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressBarDrag = (e) => {
    if (isDragging) {
      const audio = audioRef.current;
      const progressBar = progressBarRef.current;
      const newPosition =
        (e.nativeEvent.offsetX / progressBar.clientWidth) * 100;
      setProgress(newPosition);
      audio.currentTime = (newPosition / 100) * audio.duration;
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setTouchStartPosition(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (isDragging) {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;
        const touchPosition = e.touches[0].clientX;
        const progressBarRect = progressBar.getBoundingClientRect();
        const newPosition =
          ((touchPosition - progressBarRect.left) / progressBarRect.width) *
          100;

        const clampedPosition = Math.max(0, Math.min(100, newPosition));

        setProgress(clampedPosition);
        audio.currentTime = (clampedPosition / 100) * audio.duration;

        if (
          touchPosition < progressBarRect.left ||
          touchPosition > progressBarRect.right
        ) {
          setIsDragging(false);
        }
      }
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      const audio = audioRef.current;
      setIsDragging(false);
      if (isPlaying) {
        audio.play();
      }
    }
  }, [isDragging, isPlaying]);

  useEffect(() => {
    const handleGlobalTouchMove = (e) => {
      handleTouchMove(e);
    };
    const handleGlobalTouchEnd = () => {
      handleTouchEnd();
    };

    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return currentTrack ? (
    <div className="music-player">
      <div className="music-player-box">
        <div className="music-player--image">
          <LazyLoadImage
            src={currentTrackImage}
            width={
              contentQuality === "low"
                ? 50
                : contentQuality === "normal"
                  ? 150
                  : contentQuality === "high"
                    ? 500
                    : 150
            }
            height={
              contentQuality === "low"
                ? 50
                : contentQuality === "normal"
                  ? 150
                  : contentQuality === "high"
                    ? 500
                    : 150
            }
            alt="player-image"
          />
        </div>
        <div className="music-player--details">
          <span className="music-player--details-name">{currentTrackName}</span>
          <span className="music-player--details-artists">
            {currentTrackArtists}
          </span>
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            onMouseDown={handleProgressBarMouseDown}
            onMouseMove={handleProgressBarDrag}
            onMouseUp={handleProgressBarMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: "90%",
              height: "5px",
              backgroundColor: "#4e4e4e",
              borderRadius: "5px",
              marginTop: "6px",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                height: "6px",
                borderRadius: "6px",
                backgroundColor: "#1DB954",
                width: `${progress}%`,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "-3px",
                left: `${progress}%`,
                transform: "translateX(-50%)",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              }}
            ></div>
          </div>
        </div>
        {currentTrackLink ? (
          <div className="music-player--controls">
            <span
              className="music-player--controls-item"
              onClick={handleTogglePlay}
            >
              {isAudioLoading && (
                <div className="music-player--controls-preloader"></div>
              )}
              {isPlaying && !isAudioLoading ? (
                <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                </svg>
              ) : (
                <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                </svg>
              )}
            </span>
            <span
              className="music-player--controls-item"
              onClick={handleNextTrack}
            >
              <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M17.7 3a.7.7 0 0 0-.7.7v6.805L5.05 3.606A.7.7 0 0 0 4 4.212v15.576a.7.7 0 0 0 1.05.606L17 13.495V20.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </span>
          </div>
        ) : (
          <div className="music-player--controls">
            <span className="music-player--controls-item">
              <svg
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                style={{ fill: "#737373" }}
              >
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>
            </span>
            <span className="music-player--controls-item">
              <svg
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                style={{ fill: "#737373" }}
              >
                <path d="M17.7 3a.7.7 0 0 0-.7.7v6.805L5.05 3.606A.7.7 0 0 0 4 4.212v15.576a.7.7 0 0 0 1.05.606L17 13.495V20.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default MusicPlayer;
