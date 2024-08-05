import { useContext, useEffect, useCallback } from "react";
import axios from "axios";
import MusicContext from "../../context/music/MusicContext";

const useMusicUtility = () => {
  const {
    currentTrack,
    setCurrentTrack,
    setIsAudioLoading,
    contentQuality,
    audioRef,
    isAudioPlaying,
    setIsAudioPlaying,
  } = useContext(MusicContext);

  const saavnApiBaseUrl = process.env.REACT_APP_SAAVNAPI_BASEURL;

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
        if (cachedTrackData.link) {
          handleToggleAudioPlay();
        }
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
        if (trackData.link) {
          handleToggleAudioPlay();
        }
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

  const handleToggleAudioPlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio.paused && !isAudioPlaying) {
      audio.play();
      setIsAudioPlaying(true);
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  }, []);

  const handleNextAudioTrack = useCallback(async () => {
    const audio = audioRef.current;
    try {
      const trackIdToFetch = await getSuggestedTrackId();
      audio.pause();
      setIsAudioPlaying(false);
      setIsAudioLoading(true);
      await getTrack(trackIdToFetch);
    } catch (error) {
      console.error("Error handling next track:", error);
    } finally {
      setIsAudioLoading(false);
    }
  }, [getTrack]);

  const getSuggestedTrackId = async () => {
    const { data } = await axios.get(
      `${saavnApiBaseUrl}/songs/${currentTrack.id}/suggestions`,
      { params: { limit: 5 } },
    );
    const suggestedTrackId = data.data[Math.floor(Math.random() * 5)].id;
    return suggestedTrackId;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (currentTrack.id) {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: currentTrack.name,
          artist: currentTrack.artists,
          album: currentTrack.album,
          artwork: [
            {
              src: currentTrack.image,
              sizes: "500x500",
              type: "image/jpg",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", handleToggleAudioPlay);

        navigator.mediaSession.setActionHandler("pause", handleToggleAudioPlay);

        navigator.mediaSession.setActionHandler(
          "nexttrack",
          handleNextAudioTrack,
        );

        navigator.mediaSession.setActionHandler("stop", () => {
          audio.pause();
          setIsAudioPlaying(false);
        });
      }
    }
  }, [currentTrack, handleToggleAudioPlay]);

  useEffect(() => {
    const playAudio = async () => {
      if (currentTrack.link && !isAudioPlaying) {
        try {
          const audio = audioRef.current;
          audio.src = currentTrack.link;
          await audio.play();
          setIsAudioPlaying(true);
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsAudioPlaying(false);
        }
      }
    };
    playAudio();
  }, [currentTrack.link]);

  return {
    getTrack,
    deleteCachedAudioData,
    handleToggleAudioPlay,
    handleNextAudioTrack,
  };
};

export default useMusicUtility;
