import { io } from "socket.io-client";
import { userInfo } from "./UserInfo";

const socket = io("https://fm-server-2xtf.onrender.com", {
  withCredentials: true,
});

const socketUser = {
  id: Number,
  joinedRoomIds: [
    2963293620915324, 6238265482692720, 4597632018763216, 3079456106472531,
    7631984562300175, 4562789312789312,
  ],
};

socket.on("connect", () => {
  console.log("Socket Connected :", socket.id);
  socketUser.id = socket.id;
  console.log("User connected : ", socketUser.id);
  socket.emit(
    "join-rooms",
    socketUser.joinedRoomIds,
    socketUser.id,
    userInfo.username,
  );
});
socket.on("disconnect", () => {
  console.log("User Disconnected", socket.id);
});

export { socket, socketUser };
