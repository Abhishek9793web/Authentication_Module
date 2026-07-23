const jwt =
  require('jsonwebtoken');


const setupSocket = (io) => {


  // ==========================================
  // SOCKET AUTHENTICATION
  // ==========================================

  io.use(
    (socket, next) => {

      try {

        // Get token from client
        const token =
          socket.handshake.auth.token;


        // Check token
        if (!token) {

          return next(
            new Error(
              'Authentication token required'
            )
          );

        }


        // Verify JWT
        const decodedUser =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );


        // Store user ID on socket
        socket.userId =
          decodedUser.id;


        // Continue connection
        next();


      } catch (error) {

        next(
          new Error(
            'Invalid authentication token'
          )
        );

      }

    }
  );


  // ==========================================
  // USER CONNECTS
  // ==========================================

  io.on(
    'connection',
    (socket) => {

      console.log(
        'User connected:',
        socket.userId
      );


      // ==========================================
      // JOIN CONVERSATION
      // ==========================================

      socket.on(
        'joinConversation',
        (conversationId) => {

          const roomName =
            `conversation_${conversationId}`;


          // Join conversation room
          socket.join(
            roomName
          );


          console.log(
            `User ${socket.userId} joined ${roomName}`
          );

        }
      );


      // ==========================================
      // LEAVE CONVERSATION
      // ==========================================

      socket.on(
        'leaveConversation',
        (conversationId) => {

          const roomName =
            `conversation_${conversationId}`;


          // Leave conversation room
          socket.leave(
            roomName
          );


          console.log(
            `User ${socket.userId} left ${roomName}`
          );

        }
      );


      // ==========================================
      // DISCONNECT
      // ==========================================

      socket.on(
        'disconnect',
        () => {

          console.log(
            `User ${socket.userId} disconnected`
          );

        }
      );

    }
  );

};


module.exports =
  setupSocket;