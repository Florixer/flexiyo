import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import Headroom from "react-headroom";
import ReactJson from "@microlink/react-json-view";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";
import TrackItem from "../components/music/TrackItem";
import MusicContext from "../context/music/MusicContext";
import useMusicUtility from "../utils/music/useMusicUtility.js";
import spotifyLogo from "../assets/media/img/logo/spotifyLogo.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useDownloader from "react-use-downloader";
import { Capacitor } from "@capacitor/core";
Modal.setAppElement("#root"); // Set the root element for accessibility
const Music = () => {
  const {
    currentTrack,
    setCurrentTrack,
    topTracks,
    setTopTracks,
    isSpeechModalOpen,
    setIsSpeechModalOpen,
    contentQuality,
    isNetworkConnected,
  } = useContext(MusicContext);
  const { download } = useDownloader;
  const { getTrack, deleteCachedAudioData } = useMusicUtility();
  const [searchText, setSearchText] = useState("");
  const [searchFieldActive, setSearchFieldActive] = useState(false);
  const [printError, setPrintError] = useState("");
  const [apiError, setApiError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [modalDownloadData, setModalDownloadData] = useState("");
  const [isDownlodModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const saavnApiBaseUrl = "https://saavn.dev/api";

  const getTopTracks = async () => {
    setApiLoading(true);
    try {
      const { data: response } = await axios.get(
        `${saavnApiBaseUrl}/playlists?id=1134543272&limit=50`,
      );
      setTopTracks(response.data.songs);
      setTracks(response.data.songs);
      setApiLoading(false);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      setApiLoading(false);
    }
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      if (!isNetworkConnected) {
        const cachedTracks = localStorage.getItem("cachedTracks");
        const cachedTracksObject = JSON.parse(cachedTracks);
        setTopTracks(Object.values(cachedTracksObject));
        setTracks(Object.values(cachedTracksObject));
      } else {
        getTopTracks();
      }
    } else {
      getTopTracks();
    }
  }, [isNetworkConnected]);

  const openDownloadModal = async (trackId) => {
    try {
      setIsDownloadLoading(true);
      // Fetch the audio data
      const { data } = await axios.get(`${saavnApiBaseUrl}/songs/${trackId}`);

      const resultData = data.data[0];
      // Show a confirmation dialog
      const artistsArray = resultData.artists.primary;
      setModalDownloadData({
        fileUrl: resultData.downloadUrl[4].url,
        fileName: `${resultData.name} - ${artistsArray[0].name}.mp3`,
      });
      setIsDownloadModalOpen(true);
      setApiError(false);
    } catch (error) {
      setApiError(true);
      setPrintError(`${error.code} : ${error.message}`);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  // Native Speech Recognition

  // Web Speech Recognition

  const { listening: speechListening, transcript: speechTranscript } =
    useSpeechRecognition({
      commands: [
        {
          command: "play",
          callback: () => {
            closeSpeechModal();
          },
        },
        {
          command: "play *",
          callback: (speechSearchTerm) => playOnSpeechCommand(speechSearchTerm),
        },
      ],
    });

  // Function to open speech modal and pause audio
  const openSpeechModal = () => {
    setIsSpeechModalOpen(true);
    SpeechRecognition.startListening();
  };

  // Function to close speech modal and resume audio
  const closeSpeechModal = () => {
    setIsSpeechModalOpen(false);
    SpeechRecognition.stopListening();
  };

  const startSpeechRecognition = () => {
    SpeechRecognition.startListening();
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 7000);
  };

  const speechModalWaves = document.querySelectorAll(
    ".speechWaveBox1, .speechWaveBox2, .speechWaveBox3, .speechWaveBox4, .speechWaveBox5",
  );
  if (speechListening) {
    speechModalWaves.forEach((element) => {
      element.style.animationPlayState = "running";
    });
  } else {
    speechModalWaves.forEach((element) => {
      element.style.animationPlayState = "paused";
    });
  }

  useEffect(() => {
    if (
      !speechListening &&
      speechTranscript &&
      !speechTranscript.toLowerCase().startsWith("play")
    ) {
      searchTracks(speechTranscript);
      setSearchText(speechTranscript);
      closeSpeechModal();
    }
  }, [speechListening, speechTranscript]);

  const playOnSpeechCommand = (speechSearchTerm) => {
    if (speechSearchTerm) {
      searchSpeechTracks(speechSearchTerm);
      setSearchText(speechSearchTerm);
      setTimeout(() => {
        closeSpeechModal();
      }, 1000);
    }
  };

  const customModalStyles = {
    content: {
      top: "45%",
      left: "50%",
      // margin: "0 0 0 2rem",
      maxWidth: "600px",
      width: "90%",
      transform: "translate(-50%, -50%)",
      border: "0",
      borderRadius: "1rem",
      height: "20rem",
      fontFamily: "SpotifyMedium",
      color: "var(--fm-primary-link)",
      backgroundColor: "var(--fm-secondary-bg-color)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: "1",
    },
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (searchTerm, event) => {
    event.preventDefault();
    searchTracks(searchTerm);
  };

  const searchTracks = async (searchTerm) => {
    try {
      setApiLoading(true);
      const { data: response } = await axios.get(
        `${saavnApiBaseUrl}/search/songs`,
        {
          params: {
            query: searchTerm,
            page: 1,
            limit: 30,
          },
        },
      );
      setTracks(response.data.results);
      setApiError(false);
      setApiLoading(false);
    } catch (error) {
      setApiError(true);
      setPrintError(`${error.code} : ${error.message}`);
      setApiLoading(false);
    }
  };
  const searchSpeechTracks = async (searchTerm) => {
    try {
      setApiLoading(true);
      const { data: response } = await axios.get(
        `${saavnApiBaseUrl}/search/songs`,
        {
          params: {
            query: searchTerm,
            page: 1,
            limit: 30,
          },
        },
      );
      setTracks(response.data.results);
      getTrack(response.data.results[0].id);
      setApiError(false);
      setApiLoading(false);
    } catch (error) {
      setApiError(true);
      setPrintError(`${error.code} : ${error.message}`);
      setApiLoading(false);
    }
  };

  const downloadTrack = async (trackId) => {
    try {
      // Fetch the MP3 file as a blob with progress tracking
      const response = await axios.get(modalDownloadData.fileUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const current = progressEvent.loaded;
          const percentCompleted = Math.floor((current / total) * 100);
          setDownloadProgress(percentCompleted);
        },
      });

      const blob = new Blob([response.data], { type: "audio/mp4" });

      // Create a link element and trigger a download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = modalDownloadData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Call the callback function to indicate download completion
      closeDownloadModal();
    } catch (error) {
      console.error(`Error downloading track: ${error.message}`);
    }
  };

  const renderTracks = () => {
    return tracks.map((track, index) => (
      <TrackItem
        track={track}
        index={index}
        onGetTrack={getTrack}
        onOpenDownloadModal={(trackId) => openDownloadModal(trackId)}
        isDownloadLoading={isDownloadLoading}
      />
    ));
  };

  return (
    <section id="music">
      <Headroom>
        <CustomTopNavbar
          navbarPrevPage="/"
          navbarCover={spotifyLogo}
          navbarTitle="Music"
          navbarFirstIcon="fa fa-list-music"
          navbarSecondIcon="fa fa-gear"
        />
      </Headroom>
      <div className="music-container">
        <div className="search-container">
          <form className="search-box">
            <div
              className="search-bar"
              style={{
                border: `${
                  searchFieldActive
                    ? ".1rem solid var(--fm-primary-text"
                    : ".1rem solid var(--fm-secondary-bg-color)"
                }`,
              }}
            >
              <i
                className="far fa-search search-magnify-icon"
                style={{
                  color: `${
                    searchFieldActive
                      ? "var(--fm-primary-text)"
                      : "var(--fm-primary-text-muted)"
                  }`,
                }}
              ></i>
              <input
                type="text"
                className="search-input-field"
                placeholder="Search Tracks..."
                onChange={handleSearchChange}
                value={searchText}
                onFocus={() => setSearchFieldActive(true)}
                onBlur={() => setSearchFieldActive(false)}
              />
            </div>
            <div
              id="searchSubmitBtn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                right: "0",
                borderRadius: "0",
                height: "2.7rem",
              }}
            >
              <i
                className="fm-primary-btn fa fa-microphone"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 1.1rem",
                  height: "100%",
                }}
                onClick={openSpeechModal}
              ></i>
              <button
                type="submit"
                className="fm-primary-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 1rem",
                  height: "100%",
                  borderLeft: ".1rem solid var(--fm-secondary-bg-color)",
                }}
                onClick={(event) => handleSearchSubmit(searchText, event)}
              >
                <i
                  className={`${
                    apiLoading ? "fa fa-spinner fa-spin" : "fa fa-search"
                  }`}
                ></i>
              </button>
            </div>
          </form>
        </div>
        <div
          className={`print-error alert alert-danger ${
            apiError ? "" : "hidden"
          }`}
        >
          {printError}
        </div>
        <button
          className="fm-primary-btn"
          style={{ padding: ".5rem", marginLeft: "1rem" }}
          onClick={deleteCachedAudioData}
        >
          Clear Cached Data
        </button>
        <div className="render-tracks">{renderTracks()}</div>
        <Modal
          isOpen={isDownlodModalOpen}
          onRequestClose={closeDownloadModal}
          contentLabel="Download Modal"
          style={customModalStyles}
        >
          <h4>Do you want to download?</h4>
          <br />
          <b style={{ color: "var(--fm-primary-text)" }}>
            {modalDownloadData.trackName}
            <br />
            •&nbsp;&nbsp;320kbps (High Quality)
            <br />
            <br />
          </b>
          <p>Download in progress: {downloadProgress}%</p>
          <progress value={downloadProgress} max="100"></progress>
          <button
            className="fm-primary-btn-inverse"
            onClick={closeDownloadModal}
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "2rem",
              padding: "1rem",
              width: "8rem",
              borderRadius: ".5rem",
            }}
          >
            Cancel
          </button>
          <button
            className="fm-primary-btn"
            onClick={() => downloadTrack(modalDownloadData.trackId)}
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              padding: "1rem",
              width: "8rem",
              borderRadius: ".5rem",
            }}
          >
            Download
          </button>
        </Modal>
        <Modal
          isOpen={isSpeechModalOpen}
          onRequestClose={closeSpeechModal}
          contentLabel="Speech Recognition Modal"
          style={customModalStyles}
        >
          <div className="speechWave">
            <div
              class="speechWaveBoxContainer"
              style={{
                outline:
                  !speechTranscript && !speechListening
                    ? ".5rem solid red"
                    : "0",
              }}
              onClick={startSpeechRecognition}
            >
              <div className="speechWaveBox speechWaveBox1"></div>
              <div className="speechWaveBox speechWaveBox2"></div>
              <div className="speechWaveBox speechWaveBox3"></div>
              <div className="speechWaveBox speechWaveBox4"></div>
              <div className="speechWaveBox speechWaveBox5"></div>
            </div>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "var(--fm-primary-text)",
              textAlign: "center",
              fontFamily: "SpotifyMedium",
              fontSize: "1.3rem",
            }}
          >
            {!speechTranscript && !speechListening
              ? "Didn't Catch, Speak again"
              : !speechTranscript
                ? `Play "${topTracks[0].name}"`
                : speechTranscript}
            <br />
            <br />
            {!speechTranscript && !speechListening ? (
              <button
                className="fm-primary-btn-outline"
                style={{
                  padding: ".5rem",
                  width: "8rem",
                  borderRadius: ".5rem",
                  fontSize: ".9rem",
                }}
                onClick={startSpeechRecognition}
              >
                Try Again
              </button>
            ) : null}
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default Music;
