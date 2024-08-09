import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MusicContext from "../../context/music/MusicContext";
import useMusicUtility from "../../utils/music/useMusicUtility";
import axios from "axios";
const TrackDeck = () => {
  const {
    getMmTrackLyrics,
    handleAudioPlay,
    handleAudioPause,
    handleNextAudioTrack,
  } = useMusicUtility();
  const {
    currentTrack,
    audioRef,
    isAudioPlaying,
    isAudioLoading,
    audioProgress,
    setAudioProgress,
  } = useContext(MusicContext);

  const saavnApiBaseUrl = "https://saavn.dev/api";
  const lyricsWrapperRef = useRef(null);

  let currentTrackLyrics;

  const getTrackLyrics = async () => {
    lyricsWrapperRef.current.innerHTML = `<div style="display: flex; height: 90%; justify-content: center; align-items: center;">Loading...</div>`;
    const { data } = await axios.get(
      `${saavnApiBaseUrl}/songs/${currentTrack.id}/lyrics`,
    );
    currentTrackLyrics = data.data.lyrics.replace("<br>", "<br/>");
    lyricsWrapperRef.current.innerHTML = currentTrackLyrics;
  };

  useEffect(() => {
    const getTrackLyricsLocal = async () => {
      if (currentTrack.hasLyrics) {
        getTrackLyrics();
      } else {
        // lyricsWrapperRef.current.innerHTML = `<div style="display: flex; height: 90%; justify-content: center; align-items: center;">Couldn't load lyrics for this song.</div>`;
        currentTrackLyrics = await getMmTrackLyrics();
        lyricsWrapperRef.current.innerHTML = currentTrackLyrics;
      }
    };
    getTrackLyricsLocal();
  }, [currentTrack]);

  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = matchMedia("(max-width: 950px)");
    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const newPosition = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(newPosition);
      }
    };

    const handleEnded = () => {
      handleNextAudioTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleNextAudioTrack, isDragging]);

  const handleProgressBarClick = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    const newPosition = (e.nativeEvent.offsetX / progressBar.clientWidth) * 100;
    setAudioProgress(newPosition);
    audio.currentTime = (newPosition / 100) * audio.duration;
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

        setAudioProgress(clampedPosition);
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
      if (isAudioPlaying) {
        audio.play();
      }
    }
  }, [isDragging, isAudioPlaying]);

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

  return (
    <div className="track-deck">
      <div className="track-deck--cover">
        <LazyLoadImage
          src={`${currentTrack.image.replace("150x150", "500x500")}`}
          alt="player-image"
        />
      </div>
      <div className="track-deck--details">
        <label className="track-deck--details-name">{currentTrack.name}</label>
        <label className="track-deck--details-artists">
          {currentTrack.artists}
        </label>
      </div>
      <div
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "90%",
          height: "4px",
          backgroundColor: "#4e4e4e",
          borderRadius: "5px",
          margin: "0 0",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            height: "4px",
            borderRadius: "4px",
            backgroundColor: "#fff",
            width: `${audioProgress}%`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: `${audioProgress}%`,
            transform: "translateX(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
          }}
        ></div>
      </div>
      <div className="track-deck--controls">
        <span className="track-deck--controls-item">
          <svg role="img" aria-hidden="true" fill="#353333" viewBox="0 0 16 16">
            <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
          </svg>
        </span>
        {isAudioPlaying && !isAudioLoading && currentTrack.link ? (
          <span
            className="track-deck--controls-item"
            style={{
              width: isMobile ? "4rem" : "3rem",
              height: isMobile ? "4rem" : "3rem",
              backgroundColor: "#ffffff",
              padding: isMobile ? "1.2rem" : ".8rem",
            }}
            onClick={handleAudioPause}
          >
            <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
            </svg>
          </span>
        ) : (
          <span
            className="track-deck--controls-item"
            style={{
              width: isMobile ? "4rem" : "3rem",
              height: isMobile ? "4rem" : "3rem",
              backgroundColor: "#ffffff",
              padding: isMobile ? "1.2rem" : ".8rem",
            }}
            onClick={handleAudioPlay}
          >
            <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
            </svg>
          </span>
        )}
        <span
          className="track-deck--controls-item"
          onClick={handleNextAudioTrack}
        >
          <svg role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#ffffff">
            <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
          </svg>
        </span>
      </div>
      <div className="track-deck--lyrics">
        <p>Lyrics</p>
        <div
          className="track-deck--lyrics-wrapper"
          ref={lyricsWrapperRef}
          style={{whiteSpace: "pre-wrap"}}
        ></div>
      </div>
    </div>
  );
};

export default TrackDeck;