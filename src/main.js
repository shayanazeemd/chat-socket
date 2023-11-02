// node
import path from "node:path";
import { fileURLToPath } from "node:url";

// libraries
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { setupDB } from "../utils/db.js";
import { setupChatSocket } from "../utils/chat/socket.js";

// models
import userModel from "./models/user-model.js";
import roomModel from "./models/room-model.js";
import messageModel from "./models/message-model.js";
import fileModel from "./models/file-model.js";

// routers
import router from "./routers/router.js";

// constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

setupDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(`${__dirname}/../uploads`));

app.use("/api", router);

const BASE_URL = process.env.BASE_URL || "http://192.168.50.21";
const PORT = process.env.PORT || 4321;

const server = app.listen(PORT, () => {
  console.log(`Server Started on Port ${BASE_URL}:${PORT} Successfully!`);
});

setupChatSocket({
  server,
  origin: "http://192.168.50.21:3000",
  fileUploadPath: `${__dirname}/../uploads`,
  mongooseUserModel: userModel,
  mongooseRoomModel: roomModel,
  mongooseMessageModel: messageModel,
  mongooseFileModel: fileModel,
});
