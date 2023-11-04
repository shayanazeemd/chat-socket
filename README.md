# Chat Socket

This is an example of implementing a chat using sockets.

## Setup Chat Socket Function

This function sets up a chat server using Socket.IO for real-time communication. It handles various chat-related events such as joining a room, sending messages, updating messages, and handling typing and message seen indicators.

### It sets up event listeners:

#### "join_room": Triggered when a client socket joins a specific room.

1. Joins the client socket to the specified room.
2. Emits an "update_messages" event to all clients in the room, sending the existing messages of the joined room.

#### "send_message": Triggered when a client socket sends a message.

1. If the message includes an attachment, saves the attachment to the specified file path.
2. Creates a new message entry in the database and updates the room's messages with the new message's ID.
3. Emits an "update_messages" event to all clients in the room, sending the updated list of messages.

#### "update_seen_message": Triggered when a client socket marks a message as seen.

1. Marks the specified message as seen in the database.
2. Emits an "update_messages" event to all clients in the room, sending the updated list of messages.

#### "send_typing_user": Triggered when a user starts typing in a room.

1. Emits a "receive_typing_user" event to all clients in the room, sending the typing user's data.

#### "clear_typing_user": Triggered when a user stops typing in a room.

1. Emits a "receive_clear_typing_user" event to all clients in the room, indicating that the specified user's typing indicator should be cleared.

## Note

1. It assumes that you have uploads folder at root level (if you don't want it at root level you can change it while calling setupChatSocket function).
2. You can also change cors origin while calling setupChatSocket function.
