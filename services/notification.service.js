const Notification = require('../models/Notification');
const { getIO } = require('../config/socket.config');

const createNotification = async (recipientId, title, message, type = 'info') => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type
    });

    // Attempt to emit via Socket.IO
    try {
      const io = getIO();
      io.to(recipientId.toString()).emit('notification', {
        _id: notification._id,
        title,
        message,
        type,
        isRead: false,
        createdAt: notification.createdAt
      });
      console.log(`Socket notification sent to room: ${recipientId}`);
    } catch (socketError) {
      // Socket io might not be running/initialized (e.g. in some server contexts/tests), ignore error
      console.log('Notification saved but Socket.io not connected/initialized.');
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
};

const broadcastNotification = async (title, message, type = 'announcement') => {
  try {
    // Standard Socket broadcast for connected users
    try {
      const io = getIO();
      io.emit('broadcast', {
        title,
        message,
        type,
        createdAt: new Date()
      });
      console.log('Socket notification broadcasted to all connected clients.');
    } catch (socketError) {
      console.log('Broadcast saved/emitted, but Socket.io not active.');
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to broadcast notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  broadcastNotification
};
