import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket, socketUser } from "../../data/user/SocketService";
import Headroom from "react-headroom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomTopNavbar from "../../layout/items/CustomTopNavbar";
import UserFilesSheet from "../../components/direct/chat/UserFilesSheet";
import { userInfo } from "../../data/user/UserInfo";

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const inputMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isUserFilesSheetOpen, setIsUserFilesSheetOpen] = useState(false);
  let { currentRoomId } = useParams();
  currentRoomId = parseInt(currentRoomId, 10);
  const messagesEndRef = useRef(null);

  const scrollChatToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
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
    scrollChatToBottom();
    inputMessageRef.current.focus();
  };

  useEffect(() => {
    scrollChatToBottom();
  }, []);

  useEffect(() => {
    // Listen for incoming messages from the server
    const handleRecieveMessage = (username, message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          sender: username,
        },
      ]);
      scrollChatToBottom();
    };

    socket.on("recieve-message", handleRecieveMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("recieve-message", handleRecieveMessage);
    };
  }, []);

  const openUserFilesSheet = () => {
    setIsUserFilesSheetOpen(true);
  };

  const closeUserFilesSheet = () => {
    setIsUserFilesSheetOpen(false);
  };

  return (
    <section id="chat">
      <Headroom>
        <CustomTopNavbar
          navbarPrevPage="/direct/inbox"
          navbarCover={userInfo.pfp}
          navbarTitle="jason.fiyo"
          navbarFirstIcon="fa fa-phone"
          navbarSecondIcon="fa fa-video"
        />
      </Headroom>
      <UserFilesSheet
        openUserFilesSheet={openUserFilesSheet}
        isUserFilesSheetOpen={isUserFilesSheetOpen}
        setIsUserFilesSheetOpen={setIsUserFilesSheetOpen}
      />
      <div className="chat-area">
        <div className="chat-details" onClick={closeUserFilesSheet}>
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
        </div>
        <div className="chat-messages" onClick={closeUserFilesSheet}>
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
          <div ref={messagesEndRef}></div>
        </div>
        <div className="chat-messenger">
          <form className="chat-messenger-box" onSubmit={handleSendMessage}>
            <div className="chat-messenger--left" onClick={openUserFilesSheet}>
              <i className="fa fa-paperclip"></i>
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
            <div className="chat-messenger--right" onClick={handleSendMessage}>
              <i type="submit" className="fa fa-paper-plane"></i>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
