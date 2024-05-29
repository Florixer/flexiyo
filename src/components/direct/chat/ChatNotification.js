import { useState, useEffect } from "react";
import { socket, socketUser } from "../../../data/user/SocketService";
const ChatNotification = () => {
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    // Listen for incoming messages from the server
    const handleRecieveMessage = (username, message) => {
      setNotification({ title: username, content: message });
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    };

    socket.on("recieve-message", handleRecieveMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("recieve-message", handleRecieveMessage);
    };
  }, []);
  return (
    <div
      className={`chat-notification ${notification !== null ? "active" : null}`}
    >
      {notification !== null ? (
        <>
          <div className="chat-notification--pfp">
            <img src="https://i.pravatar.cc/300" alt="notification-pfp" />
          </div>
          <div className="chat-notification--body">
            <span className="chat-notification--body-title">
              {notification.title}
            </span>
            <span className="chat-notification--body-content">
              {notification.content}
            </span>
          </div>{" "}
        </>
      ) : null}
    </div>
  );
};

export default ChatNotification;
