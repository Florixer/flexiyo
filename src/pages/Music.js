import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import axios from "axios";
import Modal from "react-modal";
import Headroom from "react-headroom";
import matchMedia from "matchmedia";
import CustomTopNavbar from "../layout/items/CustomTopNavbar";
import TrackItem from "../components/music/TrackItem";
import TrackDeck from "../components/music/TrackDeck";
import MusicContext from "../context/music/MusicContext";
import useMusicUtility from "../utils/music/useMusicUtility.js";
import spotifyLogo from "../assets/media/img/logo/spotifyLogo.svg";
import WebSpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
Modal.setAppElement("#root");
const Music = () => {
  const {
    topTracks,
    setTopTracks,
    currentTrack,
    setCurrentTrack,
    isTrackDeckModalOpen,
    setIsTrackDeckModalOpen,
  } = useContext(MusicContext);

  document.title = `${currentTrack.name} - Flexiyo Music`;
  const location = useLocation();

  const { getTrackData, getTrack, deleteCachedAudioData, handleAudioPause } =
    useMusicUtility();
  const [searchText, setSearchText] = useState();
  const [searchFieldActive, setSearchFieldActive] = useState(false);
  const [printError, setPrintError] = useState("");
  const [apiError, setApiError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [modalDownloadData, setModalDownloadData] = useState("");
  const [isDownlodModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = matchMedia("(max-width: 950px)");
    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const fetchTrackData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const trackParam = queryParams.get("track");

      if (trackParam) {
        try {
          const trackData = await getTrackData(trackParam);

          if (trackData) {
            const { link, ...rest } = trackData;
            setCurrentTrack(rest);
            setIsTrackDeckModalOpen(true);
          }
        } catch (error) {
          console.error("Error fetching track data:", error);
        }
      }
    };

    fetchTrackData();
  }, []);

  const saavnApiBaseUrl = process.env.REACT_APP_SAAVNAPI_BASEURL;

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

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const q = queryParams.get("q");
    setSearchText(q);
  }, [location.search]);

  useEffect(() => {
    if (searchText) {
      handleSearchSubmit(searchText);
    } else {
      getTopTracks();
    }
  }, [searchText]);
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

  // Function to open speech modal and pause audio
  const openSpeechModal = () => {
    setIsSpeechModalOpen(true);
    startSpeechRecognition();
    handleAudioPause();
  };

  // Function to close speech modal and resume audio
  const closeSpeechModal = () => {
    setIsSpeechModalOpen(false);
    stopSpeechRecognition();
  };

  const startSpeechRecognition = () => {
    WebSpeechRecognition.startListening();
    setTimeout(() => {
      closeSpeechModal();
    }, 10000);
  };

  const stopSpeechRecognition = () => {
    WebSpeechRecognition.stopListening();
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
      const searchTts = new Audio(
        `https://www.google.com/speech-api/v1/synthesize?text=${encodeURIComponent(
          speechTranscript,
        )}&enc=mpeg&lang=hi-in&speed=.5&client=lr-language-tts&use_google_only_voices=1`,
      );
      searchTts.play();
      closeSpeechModal();
    }
  }, [speechListening, speechTranscript]);

  const playOnSpeechCommand = (speechSearchTerm) => {
    if (speechSearchTerm) {
      searchSpeechTracks(speechSearchTerm);
      setSearchText(speechSearchTerm);
      closeSpeechModal();
      setTimeout(() => {
        stopSpeechRecognition();
      }, 1000);
    }
  };

  const customModalStyles = {
    content: {
      top: "45%",
      left: "50%",
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

  const trackDeckModalStyles = {
    content: {
      inset: "0",
      padding: "0",
      zIndex: "1",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: "1",
    },
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (searchTerm) => {
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
      setDownloadProgress(0);
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
      {currentTrack.id && (
        <Helmet>
          <meta
            name="description"
            content={`Listen to ${currentTrack.name} by ${currentTrack.artists
              .split(",")[0]
              .trim()} on Flexiyo Music.`}
          />
          <meta
            property="og:title"
            content={`${currentTrack.name} - Flexiyo Music`}
          />
          <meta
            property="og:description"
            content={`Listen to ${currentTrack.name} by ${currentTrack.artists
              .split(",")[0]
              .trim()} on Flexiyo Music.`}
          />
          <meta
            property="keywords"
            content={`${currentTrack.name}, ${currentTrack.artists}, Flexiyo Music, Music, Song, Track, Download, Listen,`}
          />
          <meta
            property="og:image"
            content={currentTrack.image.replace(/(50x50|150x150)/, "500x500")}
          />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={`${currentTrack.name} - Flexiyo Music`}
          />
          <meta
            name="twitter:description"
            content={`Listen to ${currentTrack.name} by ${currentTrack.artists
              .split(",")[0]
              .trim()} on Flexiyo Music.`}
          />
          <meta
            name="twitter:image"
            content={currentTrack.image.replace(/(50x50|150x150)/, "500x500")}
          />
        </Helmet>
      )}
      <div className="music-container">
        {isMobile ? (
          <Headroom>
            <CustomTopNavbar
              navbarPrevPage="/"
              navbarCover={spotifyLogo}
              navbarTitle="Music"
              navbarFirstIcon="fa fa-list-music"
              navbarSecondIcon="fa fa-gear"
              setBorder
            />
          </Headroom>
        ) : null}
        <div className="search-container">
          <form id="searchTracksForm" className="search-box">
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
                className="fm-primary-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 1rem",
                  height: "100%",
                  borderLeft: ".1rem solid var(--fm-secondary-bg-color)",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setSearchText("");
                }}
              >
                <i
                  className={`${
                    apiLoading ? "fa fa-spinner fa-spin" : "fa fa-x"
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
              ? `Play "${topTracks[0] && topTracks[0].name}"`
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
      {!isMobile ? (
        currentTrack.id ? (
          <TrackDeck />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100vh",
              width: "100%",
            }}
          >
            <svg
              className="music-icon"
              title="Play Music"
              width="35px"
              height="35px"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "7rem",
                height: "7rem",
                padding: "1.5rem",
                border: ".2rem solid var(--fm-primary-text)",
                borderRadius: "50%",
              }}
            >
              <path
                d="M29 6V35"
                fill="#fff"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 36.04C15 33.2565 17.2565 31 20.04 31H29V36.96C29 39.7435 26.7435 42 23.96 42H20.04C17.2565 42 15 39.7435 15 36.96V36.04Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                fill="none"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29 14.0664L41.8834 17.1215V9.01339L29 6V14.0664Z"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 8H20"
                fill="#fff"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 16H20"
                fill="#fff"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 24H16"
                fill="#fff"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <br />
            <p style={{ color: "var(--fm-primary-text-muted)" }}>
              Play a track to feel the vibe.
            </p>
            <button
              style={{
                padding: ".5rem .7rem",
                fontSize: ".7rem",
                border: "none",
                borderRadius: ".3rem",
                backgroundColor: "#0095f6",
              }}
              onClick={() => getTrack(tracks[0].id)}
            >
              Play the first track
            </button>
          </div>
        )
      ) : (
        <Modal
          className="track-deck--modal"
          style={trackDeckModalStyles}
          isOpen={isTrackDeckModalOpen}
          onRequestClose={() => setIsTrackDeckModalOpen(false)}
        >
          <div className="track-deck--modal-header">
            <i
              className="fal fa-times"
              onClick={() => setIsTrackDeckModalOpen(false)}
            />
            <i
              className="fal fa-share-alt"
              onClick={(event) => setIsShareMenuOpen(event.currentTarget)}
            />
            <Menu
              className="track-deck--modal-menu"
              anchorEl={isShareMenuOpen}
              open={isShareMenuOpen}
              onClose={() => setIsShareMenuOpen(null)}
            >
              <MenuItem
                onClick={() => {
                  setIsShareMenuOpen(null);
                  navigator.clipboard.writeText(
                    `https://flexiyo.web.app/music?track=${currentTrack.id}`,
                  );
                }}
              >
                Copy Link
              </MenuItem>
            </Menu>
          </div>
          <TrackDeck />
        </Modal>
      )}
    </section>
  );
};

export default Music;
