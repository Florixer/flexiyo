import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MusicContext from "../../context/music/MusicContext";
import useMusicUtility from "../../utils/music/useMusicUtility";
import axios from "axios";
const TrackDeck = () => {
  const { getTrack } = useMusicUtility();
  const {
    currentTrack,
    topTracks,
    isSpeechModalOpen,
    audioRef,
    isAudioLoading,
    setIsAudioLoading,
    isAudioPlaying,
    setIsAudioPlaying,
    audioProgress,
    setAudioProgress,
    isNetworkConnected,
  } = useContext(MusicContext);
  const saavnApiBaseUrl = process.env.REACT_APP_SAAVNAPI_BASEURL;

  const lyricsWrapperRef = useRef(null);

  let currentTrackLyrics;

  const getTrackLyrics = async () => {
    const { data } = await axios.get(
      `${saavnApiBaseUrl}/songs/${currentTrack.id}/lyrics`,
    );
    currentTrackLyrics = data.data.lyrics.replace("<br/>", "<br//>");
    lyricsWrapperRef.current.innerHTML = currentTrackLyrics;
  };

  useEffect(() => {
    if (currentTrack.hasLyrics) {
      getTrackLyrics();
    } else {
      lyricsWrapperRef.current.innerHTML = "Couldn't load lyrics for the song.";
    }
  }, [currentTrack.id]);

  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [nextTrackId, setNextTrackId] = useState(null);

  const progressBarRef = useRef(null);

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
    if (audio.paused && !isAudioPlaying) {
      audio.play();
      setIsAudioPlaying(true);
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  }, []);

  const handleNextTrack = useCallback(async () => {
    const audio = audioRef.current;
    try {
      const trackIdToFetch = isNetworkConnected
        ? await getSuggestedTrackId()
        : Object.keys(topTracks)[
            Math.floor(Math.random() * Object.keys(topTracks).length)
          ];
      audio.pause();
      setIsAudioPlaying(false);
      setIsAudioLoading(true);
      await getTrack(trackIdToFetch);
    } catch (error) {
      console.error("Error handling next track:", error);
    } finally {
      setIsAudioLoading(false);
    }
  }, [getTrack, isNetworkConnected, topTracks]);

  const getSuggestedTrackId = async () => {
    const { data } = await axios.get(
      `${saavnApiBaseUrl}/songs/${currentTrackId}/suggestions`,
      { params: { limit: 5 } },
    );
    const suggestedTrackId = data.data[Math.floor(Math.random() * 5)].id;
    return suggestedTrackId;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const newPosition = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(newPosition);
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
      setIsAudioPlaying(false);
    }
    return () => {
      audio.play();
      setIsAudioPlaying(true);
    };
  }, [isSpeechModalOpen]);

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

  useEffect(() => {
    const audio = audioRef.current;
    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight") {
        setAudioProgress(audioProgress + 5);
        audio.currentTime = audio.currentTime + 5;
      } else if (event.code === "Space") {
        handleTogglePlay();
      } else if (event.code === "ArrowLeft") {
        setAudioProgress(audioProgress - 5);
        audio.currentTime = audio.currentTime - 5;
      }
    });
  }, []);

  return (
    <div className="track-deck">
      <div className="track-deck--cover">
        <LazyLoadImage
          src={`${currentTrack.image.replace("150x150", "500x500")}`}
          alt="player-image"
          // src="https://c.saavncdn.com/286/WMG_190295851286-English-2017-150x150.jpg"
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
        <span
          className="track-deck--controls-item"
          style={{
            width: "2rem",
            height: "2rem",
            backgroundColor: "#ffffff",
            padding: ".5rem",
          }}
          onClick={handleTogglePlay}
        >
          {isAudioPlaying && !isAudioLoading ? (
            <svg
              role="img"
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="var(--body-bg-color)"
            >
              <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
            </svg>
          ) : (
            <svg
              role="img"
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="var(--body-bg-color)"
            >
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
            </svg>
          )}
        </span>
        <span className="track-deck--controls-item" onClick={handleNextTrack}>
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
        ></div>
      </div>
    </div>
  );
};

export default TrackDeck;
