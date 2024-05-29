import { createContext, useEffect, useState } from "react";
import { Network as CapacitorNetwork } from "@capacitor/network";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState({
    id: "",
    image: "",
    name: "",
    album: "",
    artists: "",
    link: "",
  });
  const [topTracks, setTopTracks] = useState({});
  const [topTrackIds, setTopTrackIds] = useState([]);
  const [playedTrackIds, setPlayedTrackIds] = useState([]);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [contentQuality, setContentQuality] = useState("low");
  const [isNetworkConnected, setIsNetworkConnected] = useState(
    CapacitorNetwork.getStatus().then((status) => status.connected),
  );
  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        topTracks,
        setTopTracks,
        topTrackIds,
        setTopTrackIds,
        playedTrackIds,
        setPlayedTrackIds,
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
