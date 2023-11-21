const mongoose = require("mongoose");
const User = require("./User");
const Chat = require("./Chat");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
