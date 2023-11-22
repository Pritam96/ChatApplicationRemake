const mongoose = require("mongoose");
const User = require("./User");
const Chat = require("./Chat");

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "chatId is missing"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "senderId is missing"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "content is missing"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
