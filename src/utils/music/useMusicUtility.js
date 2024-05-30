import { useContext } from "react";
import axios from "axios";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import MusicContext from "../../context/music/MusicContext";

const useMusicUtility = () => {
  const {
    currentTrack,
    setCurrentTrack,
    setPlayedTrackIds,
    setIsAudioLoading,
    contentQuality,
  } = useContext(MusicContext);

  const saavnApiBaseUrl = "https://saavn.dev/api";

  const getTrack = async (trackId) => {
    setIsAudioLoading(true);

    try {
      const cachedTracks = JSON.parse(
        localStorage.getItem("cachedTracks") || "{}",
      );

      if (cachedTracks[trackId]) {
        const cachedTrackData = cachedTracks[trackId];
        if (Capacitor.isNativePlatform()) {
          const fileData = await Filesystem.readFile({
            path: `audio_cache/${trackId}.file`,
            directory: Directory.Cache,
          });

          const audioBase64Data = `data:audio/mp4;base64,${fileData.data}`;

          setCurrentTrack({
            id: trackId,
            name: cachedTrackData.name,
            album: cachedTrackData.album,
            artists: cachedTrackData.artists,
            image: cachedTrackData.image,
            link: audioBase64Data,
          });
        } else {
          setCurrentTrack({
            id: trackId,
            name: cachedTrackData.name,
            album: cachedTrackData.album,
            artists: cachedTrackData.artists,
            image: cachedTrackData.image,
            link: cachedTrackData.link,
          });
        }

        setPlayedTrackIds((prevIds) => [...prevIds, trackId]);
        setIsAudioLoading(false);
        return;
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
              ? resultData.downloadUrl[2].url
              : contentQuality === "normal"
                ? resultData.downloadUrl[3].url
                : contentQuality === "high"
                  ? resultData.downloadUrl[4].url
                  : resultData.downloadUrl[3].url,
        };
        setCurrentTrack(trackData);
        await cacheTrackData(trackData);
      }
        setIsAudioLoading(false);
    } catch (error) {
      console.error("Error fetching track:", error);
      setIsAudioLoading(false);
    }
  };

  const deleteCachedAudioData = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { files } = await Filesystem.readdir({
          path: "audio_cache",
          directory: Directory.Cache,
        });

        for (const file of files) {
          await Filesystem.deleteFile({
            path: file,
            directory: Directory.Cache,
          });
        }
        localStorage.removeItem("cachedTracks");
        alert("Cached Audio Data deleted successfully");
      } else {
        localStorage.removeItem("cachedTracks");
        alert("Cached Audio Data deleted successfully");
      }
    } catch (e) {
      console.error("Unable to delete Cached Audio Data", e);
    }
  };
  const cacheTrackData = async (trackData) => {
    try {
      if (Capacitor.isNativePlatform()) {
        const response = await axios.get(trackData.link, {
          responseType: "blob",
        });
        const blobData = response.data;

        const reader = new FileReader();
        reader.readAsDataURL(blobData);
        reader.onloadend = async () => {
          const base64Data = reader.result;

          await Filesystem.writeFile({
            path: `audio_cache/${trackData.id}.file`,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true,
          });
        };
      }

      const cachedTracks = JSON.parse(
        localStorage.getItem("cachedTracks") || "{}",
      );
      cachedTracks[trackData.id] = trackData;
      localStorage.setItem("cachedTracks", JSON.stringify(cachedTracks));
    } catch (error) {
      console.error("Error caching track data:", error);
    }
  };

  return { getTrack, deleteCachedAudioData };
};

export default useMusicUtility;
