const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    min: 5,
    max: 15,
  },
  channel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
