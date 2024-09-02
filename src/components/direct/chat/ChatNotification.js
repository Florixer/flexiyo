import { useState, useEffect, useContext } from "react";
import UserContext from "../../../context/user/UserContext.js";
import { useSocket } from "../../../context/SocketProvider.js";

const ChatNotification = () => {
  const { userInfo } = useContext(UserContext);
  const { socket } = useSocket();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const handleReceiveMessage = (username, message) => {
      console.log("Received message:", { username, message });
      if (userInfo.username === username) return;
      setNotification({ title: username, content: message });
      setTimeout(() => {
        setNotification(null);
      }, 2500);
      console.log("Notification:", notification);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      console.log("Cleaning up receive-message listener");
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, userInfo.username]);

  return (
    <div className={`chat-notification ${notification ? "active" : ""}`}>
      {notification && (
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
          </div>
        </>
      )}
    </div>
  );
};

export default ChatNotification;
