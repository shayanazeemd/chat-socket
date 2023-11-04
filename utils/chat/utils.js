import { userModel, roomModel } from "./socket.js";

export async function getRoomData(roomId) {
  return await roomModel
    .findOne({
      _id: roomId,
    })
    .populate({
      path: "messages",
      select: "room sender receiver text attachment isSeen",
      populate: {
        path: "attachment",
        model: "file",
      },
    });
}

export async function createOrJoinRoom(
  senderUserName,
  receiverUserName
  // users
) {
  const senderUserData = await userModel
    .findOne({
      userName: senderUserName,
    })
    .populate({
      path: "userRooms",
      populate: {
        path: "users",
        select: "userName",
      },
    });
  const receiverUserData = await userModel.findOne({
    userName: receiverUserName,
  });

  if (senderUserData !== null && receiverUserData !== null) {
    let roomData = senderUserData.userRooms.find((userRoom) => {
      //   userRoom.users.sort((a, b) => {
      //     if (a._id.toString() < b._id.toString()) return -1;
      //     if (a._id.toString() > b._id.toString()) return 1;
      //     return 0;
      //   });

      //   let found = true;

      //   for (let index = 0; index < userRoom.users.length; index++) {
      //     if (users[index] !== userRoom.users[index]) {
      //       found = false;
      //     }
      //   }

      //   return found;

      return (
        (userRoom.users[0]._id.toString() === senderUserData._id.toString() &&
          userRoom.users[1]._id.toString() ===
            receiverUserData._id.toString()) ||
        (userRoom.users[1]._id.toString() === senderUserData._id.toString() &&
          userRoom.users[0]._id.toString() === receiverUserData._id.toString())
      );
    });

    if (!roomData) {
      roomData = await roomModel.create({
        users: [senderUserData._id, receiverUserData._id],
      });

      await userModel.updateOne(
        { userName: senderUserName },
        {
          userRooms: [...senderUserData.userRooms, roomData._id],
        }
      );

      await userModel.updateOne(
        { userName: receiverUserName },
        {
          userRooms: [...receiverUserData.userRooms, roomData._id],
        }
      );
    }

    return roomData;
  }
}
