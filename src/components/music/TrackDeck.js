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

  // useEffect(() => {
  //   if (currentTrack.hasLyrics) {
  //     getTrackLyrics();
  //   } else {
  //     lyricsWrapperRef.current.innerHTML = "Couldn't load lyrics for the song.";
  //   }
  // }, [currentTrack.id]);

  return (
    <div className="track-deck">
      <div className="track-deck--main"></div>
      <div className="track-deck--lyrics">
        <p>Lyrics</p>
        <div className="track-deck--lyrics-wrapper" ref={lyricsWrapperRef}>
          o, sajani re
          <br />
          kaise katen din-raat?
          <br />
          kaise ho tujh se baath?
          <br />
          teri yaad sataave re
          <br />
          <br />
          o, sajani re
          <br />
          kaise katen din-raat?
          <br />
          kaise milee tera saath?
          <br />
          teri yaad, teri yaad sataave re
          <br />
          <br />
          kaise ghanere badaraa ghiren
          <br />
          teri kamee kee baarish liye?
          <br />
          sailaab jo mere seene mein hai
          <br />
          koyi bataae, ye kaise thame
          <br />
          tere binaa ab kaise jien?
          <br />
          <br />
          o, sajani re
          <br />
          kaise katen din-raat?
          <br />
          kaise ho tujh se baath?
          <br />
          teri yaad sataave re
          <br />
          <br />
          o, sajani re
          <br />
          kaise katen din-raat?
          <br />
          kaise ho tujh se baath?
          <br />
          teri yaad, teri yaad sataave re
          <br />
          <br />
          o, sajani re
        </div>
      </div>
    </div>
  );
};

export default TrackDeck;
