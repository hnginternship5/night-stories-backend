const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_message: String,

  notification_image: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
