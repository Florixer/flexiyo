import { useContext, useEffect, useRef } from 'react';
import MusicContext from "../../context/music/MusicContext";
import useMusicUtility from "../../utils/music/useMusicUtility";
const TrackDeck = () => {
  const { getTrack } = useMusicUtility();
  const {
    topTracks,
    currentTrack,
    isNetworkConnected,
  } = useContext(MusicContext);
  const currentTrackLyrics = currentTrack.lyrics
    ? currentTrack.lyrics.replace("<br>", "<br/>")
    : null;

  const lyricsWrapperRef = useRef(null);

  useEffect(() => {
    if (lyricsWrapperRef.current) {
      lyricsWrapperRef.current.innerHTML = currentTrackLyrics;
    }
  }, [currentTrackLyrics]);
  return (
    <div className="track-deck">
      <div
        className="track-deck--lyrics"
        ref={lyricsWrapperRef}
      >{!currentTrackLyrics && <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}>Couldn't load the lyrics for this song.</div>}</div>
    </div >
  )
}

export default TrackDeck