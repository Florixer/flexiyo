import { useContext, useEffect } from "react";
import axios from "axios";
import MusicContext from "../../context/music/MusicContext";

const useMusicUtility = () => {
  const { currentTrack, setCurrentTrack, setIsAudioLoading, contentQuality } =
    useContext(MusicContext);

  const saavnApiBaseUrl = "https://saavn.dev/api";

  const getTrack = async (trackId) => {
    setIsAudioLoading(true);

    try {
      const cachedTracks = JSON.parse(
        localStorage.getItem("cachedTracks") || "{}",
      );

      if (cachedTracks[trackId]) {
        const cachedTrackData = cachedTracks[trackId];
        setCurrentTrack({
          id: trackId,
          name: cachedTrackData.name,
          album: cachedTrackData.album,
          artists: cachedTrackData.artists,
          image: cachedTrackData.image,
          link: cachedTrackData.link,
          hasLyrics: cachedTrackData.hasLyrics,
        });
        setIsAudioLoading(false);
      } else {
        const { data } = await axios.get(`${saavnApiBaseUrl}/songs/${trackId}`);
        const resultData = data.data[0];
        const trackData = {
          id: resultData.id,
          name: resultData.name,
          album: resultData.album.name,
          artists: resultData.artists.primary
            .map((artist) => artist.name)
            .join(", "),
          image:
            contentQuality === "low"
              ? resultData.image[0].url
              : contentQuality === "normal"
              ? resultData.image[1].url
              : contentQuality === "high"
              ? resultData.image[2].url
              : resultData.image[1].url,
          link:
            contentQuality === "low"
              ? resultData.downloadUrl[1].url
              : contentQuality === "normal"
              ? resultData.downloadUrl[3].url
              : contentQuality === "high"
              ? resultData.downloadUrl[4].url
              : resultData.downloadUrl[3].url,
          hasLyrics: resultData.hasLyrics,
        };
        setCurrentTrack(trackData);
        cacheTrackData(trackData);
        setIsAudioLoading(false);
      }
    } catch (error) {
      console.error("Error fetching track:", error);
      setIsAudioLoading(false);
    }
  };

  const cacheTrackData = async (trackData) => {
    const cachedTracks = JSON.parse(
      localStorage.getItem("cachedTracks") || "{}",
    );
    cachedTracks[trackData.id] = trackData;
    localStorage.setItem("cachedTracks", JSON.stringify(cachedTracks));
  };

  const deleteCachedAudioData = async () => {
    try {
      localStorage.removeItem("cachedTracks");
      alert("Cached Audio Data deleted successfully");
    } catch (e) {
      console.error("Unable to delete Cached Audio Data", e);
    }
  };

  return { getTrack, deleteCachedAudioData };
};

export default useMusicUtility;
