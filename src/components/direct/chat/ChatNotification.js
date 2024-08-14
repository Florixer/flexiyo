import { useState, useEffect, useContext } from "react";
import UserContext from "../../../context/user/UserContext";
import useSocketService from "../../../hooks/user/useSocketService";

const ChatNotification = () => {
  const { userInfo } = useContext(UserContext);
  const { socket, socketUser } = useSocketService();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleRecieveMessage = (username, message) => {
      if (userInfo.username === username) return;
      setNotification({ title: username, content: message });
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    };

    socket.on("recieve-message", handleRecieveMessage);

    return () => {
      socket.off("recieve-message", handleRecieveMessage);
    };
  }, [socket]);

  return (
    <div
      className={`chat-notification ${notification ? "active" : ""}`}
    >
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
