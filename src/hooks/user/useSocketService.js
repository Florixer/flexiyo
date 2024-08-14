import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import UserContext from "../../context/user/UserContext";

const useSocketService = () => {
  const { userInfo, isUserAuthenticated } = useContext(UserContext);
  const [socket, setSocket] = useState(null);
  const [socketUser, setSocketUser] = useState({
    id: Number,
    joinedRoomIds: [
      2963293620915324, 6238265482692720, 4597632018763216, 3079456106472531,
      7631984562300175, 4562789312789312,
    ],
  });

  useEffect(() => {
    // If the user is not authenticated, don't connect the socket
    if (!isUserAuthenticated) {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      return;
    }

    // Avoid creating a new socket if one already exists
    if (socket) return;

    const socketInstance = io("https://fm-server-2xtf.onrender.com", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket Connected:", socketInstance.id);
      setSocketUser((prevState) => ({
        ...prevState,
        id: socketInstance.id,
      }));

      if (userInfo?.username) {
        socketInstance.emit(
          "join-rooms",
          socketUser.joinedRoomIds,
          socketInstance.id,
          userInfo.username
        );
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket Disconnected:", socketInstance.id);
    });

    return () => {
      console.log("Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, [isUserAuthenticated, userInfo, socketUser.joinedRoomIds]);

  return { socket, socketUser };
};

export default useSocketService;
