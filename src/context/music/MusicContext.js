import { createContext, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network as CapacitorNetwork } from "@capacitor/network";
import logo from "../../assets/media/img/logo/flexomate_gradient.jpg";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState({});
  const [contentQuality, setContentQuality] = useState("normal");
  const [topTracks, setTopTracks] = useState({});
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [isNetworkConnected, setIsNetworkConnected] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
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
    } else {
      setIsNetworkConnected(navigator.onLine);
      window.addEventListener("online", () => {
        setIsNetworkConnected(true);
      });
      window.addEventListener("offline", () => {
        setIsNetworkConnected(false);
      });
    }

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
