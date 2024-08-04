import { useContext, useEffect, useRef } from "react";
import MusicContext from "../../context/music/MusicContext";
import useMusicUtility from "../../utils/music/useMusicUtility";
import axios from "axios";
const TrackDeck = () => {
  const { getTrack } = useMusicUtility();
  const { currentTrack } = useContext(MusicContext);
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

  return (
    <div className="track-deck">
      <div className="track-deck--cover">
        <img src={currentTrack.image} />
      </div>
      <div className="track-deck--details">
        <label className="track-deck--details-name">
          {currentTrack.name}
        </label>
        <label className="track-deck--details-artists">
          {currentTrack.artists}
        </label>
      </div>
      <div
        // ref={progressBarRef}
        // onClick={handleProgressBarClick}
        // onMouseDown={handleProgressBarMouseDown}
        // onMouseMove={handleProgressBarDrag}
        // onMouseUp={handleProgressBarMouseUp}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
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
            width: `40%`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: `40%`,
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
          <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
        </span>
        <span className="track-deck--controls-item">
          <svg role="img" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M17.7 3a.7.7 0 0 0-.7.7v6.805L5.05 3.606A.7.7 0 0 0 4 4.212v15.576a.7.7 0 0 0 1.05.606L17 13.495V20.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
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
