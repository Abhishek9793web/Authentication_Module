const Notification =
  require('../models/Notification');


// ==========================================
// CREATE NOTIFICATIONS
// ==========================================

const createMessageNotifications = async ({
  io,
  senderId,
  conversationId,
  messageId,
  participants
}) => {

  try {

    // Get Socket.IO room name
    const roomName =
      `conversation_${conversationId}`;


    // Get all sockets currently
    // connected to this conversation room
    const socketsInRoom =
      await io.in(roomName).fetchSockets();


    // Get socket IDs
    const activeSocketIds =
      socketsInRoom.map(
        socket => socket.id
      );


    console.log(
      'Active sockets:',
      activeSocketIds
    );


    // Create notifications
    for (
      const participantId
      of participants
    ) {

      // Don't notify sender
      if (
        participantId.toString() ===
        senderId.toString()
      ) {
        continue;
      }


      // IMPORTANT:
      //
      // Here we need to know which user
      // belongs to which socket.
      //
      // We will solve this by storing
      // userId on the socket.


      const receiverIsActive =
        socketsInRoom.some(
          socket =>
            socket.userId &&
            socket.userId.toString() ===
            participantId.toString()
        );


      // If receiver is currently
      // viewing the conversation
      // don't create notification
      if (receiverIsActive) {

        console.log(
          `User ${participantId} is active.`
        );

        continue;

      }


      // Create notification
      await Notification.create({

        sender:
          senderId,

        receiver:
          participantId,

        conversation:
          conversationId,

        message:
          messageId,

        isRead:
          false

      });


      console.log(
        `Notification created for ${participantId}`
      );

    }

  } catch (error) {

    console.error(
      'Notification creation error:',
      error
    );

    throw error;

  }

};


module.exports = {
  createMessageNotifications
};