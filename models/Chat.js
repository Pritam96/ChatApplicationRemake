const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "sender" },
    isGroupChat: { type: Boolean, default: false },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
