import userModel from "../models/user-model.js";
import { createOrJoinRoom } from "../../utils/chat/utils.js";

export async function logIn(req, res, next) {
  try {
    const { userName } = req.body;

    let userData = await userModel.findOne({ userName });

    if (!userData) {
      userData = await userModel.create({ userName });
    }

    return res.status(200).json({
      message: `User ${userName} Logged In.`,
      data: {
        userData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const usersData = await userModel.find({});

    return res.status(200).json({
      message: `Got All Users.`,
      data: {
        usersData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function joinRoom(req, res, next) {
  try {
    const { senderUserName, receiverUserName } = req.body;

    const roomData = await createOrJoinRoom(senderUserName, receiverUserName);

    return res.status(200).json({
      message: `Room Joint.`,
      data: { roomData },
    });
  } catch (error) {
    next(error);
  }
}
