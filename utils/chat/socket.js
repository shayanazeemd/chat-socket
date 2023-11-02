// libraries
import { Server } from "socket.io";

// models
export let userModel;
export let roomModel;
export let messageModel;
export let fileModel;

// event functions
import {
  clearTypingUser,
  joinRoom,
  sendMessage,
  sendTypingUser,
  updateSeenMessage,
} from "./events.js";

// setting up chat socket
export function setupChatSocket({
  server,
  origin,
  fileUploadPath,
  mongooseUserModel,
  mongooseRoomModel,
  mongooseMessageModel,
  mongooseFileModel,
}) {
  userModel = mongooseUserModel;
  roomModel = mongooseRoomModel;
  messageModel = mongooseMessageModel;
  fileModel = mongooseFileModel;

  const io = new Server(server, {
    cors: {
      origin,
    },
    maxHttpBufferSize: 1e8, // 100 MB
  });

  io.on("connection", (socket) => {
    socket.on("join_room", async (roomId) => {
      joinRoom(io, socket, { roomId });
    });

    socket.on("send_message", async (message) => {
      sendMessage(io, socket, { message, fileUploadPath });
    });

    socket.on("update_seen_message", async (message) => {
      updateSeenMessage(io, socket, { message });
    });

    socket.on("send_typing_user", async (roomId, userId) => {
      sendTypingUser(io, socket, { roomId, userId });
    });

    socket.on("clear_typing_user", async (roomId, userId) => {
      clearTypingUser(io, socket, { roomId, userId });
    });

    socket.on("disconnect", () => {});
  });
}
