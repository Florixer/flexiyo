import { createContext, useEffect, useState } from "react";
import { Network as CapacitorNetwork } from "@capacitor/network";
import logo from "../../assets/media/img/logo/flexomate_gradient.jpg";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [contentQuality, setContentQuality] = useState("normal");
  const [currentTrack, setCurrentTrack] = useState({
    id: "e0kCEwoC",
    image: logo,
    name: "Play a random Track",
    album: "",
    artists: "Flexiyo Music",
    link:
      contentQuality === "low"
        ? "https://aac.saavncdn.com/694/f3ca9af9ec18aadbf685b83d88c0ca2c_48.mp4"
        : contentQuality === "normal"
          ? "https://aac.saavncdn.com/694/f3ca9af9ec18aadbf685b83d88c0ca2c_160.mp4"
          : contentQuality === "high"
            ? "https://aac.saavncdn.com/694/f3ca9af9ec18aadbf685b83d88c0ca2c_320.mp4"
            : "https://aac.saavncdn.com/694/f3ca9af9ec18aadbf685b83d88c0ca2c_160.mp4",
  });
  const [topTracks, setTopTracks] = useState({});
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [isNetworkConnected, setIsNetworkConnected] = useState(false);

  useEffect(() => {
    CapacitorNetwork.getStatus().then((status) => {
      setIsNetworkConnected(status.connected);
    });
    const handleNetworkStatusChange = (status) => {
      setIsNetworkConnected(status.connected);
    };

    CapacitorNetwork.addListener(
      "networkStatusChange",
      handleNetworkStatusChange,
    );

    return () => {
      CapacitorNetwork.removeAllListeners();
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        topTracks,
        setTopTracks,
        isAudioLoading,
        setIsAudioLoading,
        isSpeechModalOpen,
        setIsSpeechModalOpen,
        contentQuality,
        setContentQuality,
        isNetworkConnected,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
