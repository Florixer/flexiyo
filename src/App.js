import "./App.css";
import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
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
import TrackPlayer from "./components/music/TrackPlayer";
import DirectInbox from "./pages/direct/Inbox";
import DirectChat from "./pages/direct/Chat";
import DirectChatNotification from "./components/direct/chat/ChatNotification";
import Stories from "./pages/Stories";
import Notifications from "./pages/Notifications";

// Contexts
import { MusicProvider } from "./context/music/MusicContext";
import { CreateProvider } from "./context/create/CreateContext";
import { UserProvider } from "./context/user/UserContext";

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
            <UserProvider>
              <Navbar />
              <DirectChatNotification />
              <TrackPlayer />
              <Routes>
                <Route path="*" element={<NotFound404 />} />
                <Route exact path="/auth/login" element={<AuthLogin />}></Route>
                <Route
                  exact
                  path="/auth/signup"
                  element={<AuthSignup />}
                ></Route>
                <Route
                  index
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route exact path="/search" element={<Search />}></Route>
                <Route exact path="/music" element={<Music />}></Route>
                <Route
                  exact
                  path="/stories"
                  element={
                    <ProtectedRoute>
                      <Stories />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="/direct/inbox"
                  element={
                    <ProtectedRoute>
                      <DirectInbox />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="direct/t/:currentRoomId"
                  element={
                    <ProtectedRoute>
                      <DirectChat />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <Create />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="/clips"
                  element={
                    <ProtectedRoute>
                      <Clips />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                ></Route>
              </Routes>
            </UserProvider>
          </CreateProvider>
        </MusicProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
