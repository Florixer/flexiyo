import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import useSocketService from "../../hooks/user/useSocketService";
import matchMedia from "matchmedia";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomTopNavbar from "../../layout/items/CustomTopNavbar";
import InboxList from "../../components/direct/InboxList";
import UserFilesSheet from "../../components/direct/chat/UserFilesSheet";
import UserContext from "../../context/user/UserContext";
import demoPersonPfp from "../../assets/media/img/demo-person.jpg";

async function generateKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );
  return { encryptedData: encrypted, iv: iv };
}

async function decryptMessage(encryptedData, iv, key) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

const Chat = () => {
  document.title = "@jason.fiyo - Chat • Flexiyo";
  const { socket, socketUser } = useSocketService();
  const { userInfo } = useContext(UserContext);
  const [userMessage, setUserMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const inputMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isUserFilesSheetOpen, setIsUserFilesSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState(null);
  useEffect(() => {
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

  const { currentRoomId } = useParams();
  const roomId = parseInt(currentRoomId, 10);

  useEffect(() => {
    if (!socket) return;

    // Generate an encryption key when the component mounts
    generateKey().then(setEncryptionKey);

    const handleReceiveMessage = async (username, encryptedMessage, iv) => {
      console.log("Received encrypted message:", encryptedMessage);
      const decryptedMessage = await decryptMessage(
        encryptedMessage,
        iv,
        encryptionKey
      );
      console.log("Decrypted message:", decryptedMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: decryptedMessage, sender: username },
      ]);
      scrollToBottom();
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, encryptionKey]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollableDiv = document.getElementById("chat-messages");
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, 0);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (inputText !== "") {
      const { encryptedData, iv } = await encryptMessage(inputText, encryptionKey);

      setMessages([
        ...messages,
        { text: inputText, sender: userInfo.username },
      ]);

      socket.emit("send-message", roomId, socketUser.id, userInfo.username, encryptedData, iv);
      setUserMessage("");
      setInputText("");
    }
    scrollToBottom();
    inputMessageRef.current.focus();
  };

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
          navbarCover={demoPersonPfp}
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
          <div className="chat-details" onClick={closeUserFilesSheet}>
            <div className="chat-details--pfp">
              <LazyLoadImage src={demoPersonPfp} alt="chat-pfp" />
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
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message--${
                message.sender !== userInfo.username ? "other" : "self"
              }`}
            >
              {message.sender !== userInfo.username ? (
                <LazyLoadImage
                  src={demoPersonPfp}
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
                  fillRule="evenodd"
                  d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                  clipRule="evenodd"
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
              disabled={!inputText}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
