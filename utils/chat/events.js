// node
import { writeFile } from "node:fs";

// utils
import { getRoomData } from "./utils.js";

// models
import { userModel, roomModel, messageModel, fileModel } from "./socket.js";

// event functions
export async function joinRoom(io, socket, { roomId }) {
  socket.join(roomId.toString());

  const foundRoomData = await getRoomData(roomId);

  io.in(roomId.toString()).emit("update_messages", foundRoomData.messages);
}

export async function sendMessage(io, _socket, { message, fileUploadPath }) {
  let foundRoomData = await getRoomData(message.room);

  if (foundRoomData) {
    if (message.attachment.fileName !== "") {
      const attachment = {
        fileName: message.attachment.fileName,
        fileType: message.attachment.fileType,
      };
      const attachmentData = await fileModel.create(attachment);

      const file = message.attachment.fileData;
      writeFile(`${fileUploadPath}/${attachment.fileName}`, file, (err) => {
        if (err) console.log(err, file);
      });

      message = { ...message, attachment: attachmentData._doc._id };
    } else {
      message = { ...message, attachment: undefined };
    }

    if (message.text !== "" || message.attachment !== undefined) {
      const messageData = await messageModel.create(message);
      await roomModel.updateOne(
        { _id: message.room },
        { messages: [...foundRoomData.messages, messageData._id] }
      );

      foundRoomData = await getRoomData(message.room);

      io.in(message.room.toString()).emit(
        "update_messages",
        foundRoomData.messages
      );
    }
  }
}

export async function updateSeenMessage(io, _socket, { message }) {
  await messageModel.findOneAndUpdate({ _id: message._id }, { isSeen: true });

  const foundRoomData = await getRoomData(message.room);

  io.in(message.room.toString()).emit(
    "update_messages",
    foundRoomData.messages
  );
}

export async function sendTypingUser(io, _socket, { roomId, userId }) {
  const currentUserData = await userModel.findOne({ _id: userId });

  io.in(roomId.toString()).emit("receive_typing_flag", currentUserData);
}

export async function clearTypingUser(io, _socket, { roomId, userId }) {
  const currentUserData = await userModel.findOne({ _id: userId });

  io.in(roomId.toString()).emit("receive_clear_typing_flag", currentUserData);
}
