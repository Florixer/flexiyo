import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket, socketUser } from "../../data/user/SocketService";
import matchMedia from "matchmedia";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomTopNavbar from "../../layout/items/CustomTopNavbar";
import InboxList from "../../components/direct/InboxList";
import UserFilesSheet from "../../components/direct/chat/UserFilesSheet";
import { userInfo } from "../../data/user/UserInfo";

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const inputMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isUserFilesSheetOpen, setIsUserFilesSheetOpen] = useState(false);
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

  let { currentRoomId } = useParams();
  currentRoomId = parseInt(currentRoomId, 10);

  function scrollToBottom() {
    var scrollableDiv = document.getElementById("chat-messages");
    scrollableDiv.scroll({
      top: scrollableDiv.scrollHeight,
      behavior: "smooth",
    });
  }

  const handleSendMessage = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (inputText !== "") {
      // Check if inputText is not empty
      setMessages([
        ...messages,
        {
          text: inputText,
          sender: socketUser.username,
        },
      ]);
      socket.emit(
        "send-message",
        currentRoomId,
        socketUser.id,
        socketUser.username,
        inputText,
      );
      setUserMessage("");
      setInputText("");
    }
    scrollToBottom();
    inputMessageRef.current.focus();
  };

  // Listen for incoming messages from the server
  const handleRecieveMessage = (username, message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: message,
        sender: username,
      },
    ]);
    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();

    socket.on("recieve-message", handleRecieveMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("recieve-message", handleRecieveMessage);
    };
  }, [handleSendMessage, handleRecieveMessage]);

  const openUserFilesSheet = () => {
    setIsUserFilesSheetOpen(true);
  };

  const closeUserFilesSheet = () => {
    setIsUserFilesSheetOpen(false);
  };

  return (
    <section id="chat">
      <UserFilesSheet
        openUserFilesSheet={openUserFilesSheet}
        isUserFilesSheetOpen={isUserFilesSheetOpen}
        setIsUserFilesSheetOpen={setIsUserFilesSheetOpen}
      />
      {!isMobile ? <InboxList /> : null}
      <div className="chat-area">
        <CustomTopNavbar
          navbarPrevPage={isMobile ? "/direct/inbox" : null}
          navbarCover={userInfo.pfp}
          navbarTitle="jason.fiyo"
          navbarFirstIcon="fa fa-phone"
          navbarSecondIcon="fa fa-video"
          setBorder={true}
        />
        <div
          className="chat-messages"
          id="chat-messages"
          onClick={closeUserFilesSheet}
        >
            {/*<div className="chat-details" onClick={closeUserFilesSheet}>
            <div className="chat-details--pfp">
              <LazyLoadImage src={userInfo.pfp} alt="chat-pfp" />
            </div>
            <div className="chat-details--name">Jason Barody</div>
            <div className="chat-details--username">Flexiyo • jason.fiyo</div>
            <div className="chat-details--button">
              <button
                className="fm-primary-btn-inverse"
                style={{
                  borderRadius: ".3rem",
                  padding: ".5rem .7rem",
                }}
              >
                View Profile
              </button>
            </div>
            <div className="chat-details--first-time">Yesterday 10:15pm</div>
          </div> */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message--${
                message.sender !== socketUser.username ? "other" : "self"
              }`}
            >
              {message.sender !== socketUser.username ? (
                <LazyLoadImage
                  src={userInfo.pfp}
                  className="chat-message--other-pfp"
                  alt="user-pfp"
                />
              ) : null}
              <span msg-type="text">{message.text}</span>
            </div>
          ))}
          {userMessage && (
            <div className="chat-message--self">
              <span msg-type="text">{userMessage}</span>
            </div>
          )}
        </div>
        <div className="chat-messenger">
          <form className="chat-messenger-box" onSubmit={handleSendMessage}>
            <div className="chat-messenger--left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                viewBox="0 0 24 24"
                onClick={openUserFilesSheet}
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="chat-messenger--center">
              <input
                ref={inputMessageRef}
                type="text"
                placeholder="Message"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <button
              className="chat-messenger--right"
              type="submit"
              onClick={handleSendMessage}
              disabled={!inputText}
            >
              <i type="submit" className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
