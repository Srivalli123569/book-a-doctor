const Notification = require('../models/Notification');

// Small internal helper other controllers call to create notifications
const createNotification = async ({ user, title, message, type = 'system', relatedAppointment }) => {
  try {
    await Notification.create({ user, title, message, type, relatedAppointment });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = createNotification;
