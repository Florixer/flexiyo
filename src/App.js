import "./App.css";
import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// React Components
import AuthLogin from "./pages/auth/Login";
import AuthSignup from "./pages/auth/Signup";
import NotFound404 from "./pages/NotFound404";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Create from "./pages/Create";
import Clips from "./pages/Clips";
import Profile from "./pages/Profile";
import Music from "./pages/Music";
import MusicPlayer from "./components/music/MusicPlayer";
import DirectInbox from "./pages/direct/Inbox";
import DirectChat from "./pages/direct/Chat";
import DirectChatNotification from "./components/direct/chat/ChatNotification";

// Contexts
import { MusicProvider } from "./context/music/MusicContext";
import { CreateProvider } from "./context/create/CreateContext";

const App = () => {
  useEffect(() => {
    const noSelectElements = document.querySelectorAll("#main");
    noSelectElements.forEach((element) => {
      element.style.webkitUserSelect = "none";
      element.style.mozUserSelect = "none";
      element.style.msUserSelect = "none";
      element.style.userSelect = "none";
    });
  }, []);

  CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    if (!canGoBack) {
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <MusicProvider>
          <CreateProvider>
            <Navbar />
            <DirectChatNotification />
            <MusicPlayer />
            <Routes>
              <Route path="*" element={<NotFound404 />} />
              <Route index exact path="/" element={<Home />}></Route>
              <Route exact path="/auth/login" element={<AuthLogin />}></Route>
              <Route exact path="/auth/signup" element={<AuthSignup />}></Route>
              <Route exact path="/search" element={<Search />}></Route>
              <Route exact path="/music" element={<Music />}></Route>
              <Route
                exact
                path="/direct/inbox"
                element={<DirectInbox />}
              ></Route>
              <Route
                exact
                path="direct/t/:currentRoomId"
                element={<DirectChat />}
              ></Route>
              <Route exact path="/create" element={<Create />}></Route>
              <Route exact path="/clips" element={<Clips />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
            </Routes>
          </CreateProvider>
        </MusicProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
