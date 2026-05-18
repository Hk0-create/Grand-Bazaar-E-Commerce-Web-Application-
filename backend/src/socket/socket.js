const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their room
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    // Join order chat room
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Joined order room: order_${orderId}`);
    });

    // Send chat message (real-time)
    socket.on('send_message', ({ orderId, message }) => {
      io.to(`order_${orderId}`).emit('receive_message', message);
    });

    // Order status update notification
    socket.on('order_status_update', ({ userId, orderId, status }) => {
      const targetSocket = onlineUsers.get(userId);
      if (targetSocket) {
        io.to(targetSocket).emit('order_status_changed', { orderId, status });
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.forEach((sId, userId) => {
        if (sId === socket.id) onlineUsers.delete(userId);
      });
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
