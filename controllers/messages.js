const ErrorResponse = require("../utils/errorResponse");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

// POST => /api/v1/auth/messages <= chatId, message-content
exports.sendMessage = async (req, res, next) => {
  const { chatId, content } = req.body;

  try {
    let message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
    });

    message = await message.populate("chat");
    message = await message.populate("sender", "name email");
    message = await User.populate(message, {
      path: "chat.members",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// GET => /api/v1/auth/chats/:chatId <= chatId
exports.getMessages = async (req, res, next) => {
  const { chatId } = req.params;
  if (!chatId) {
    return next(new ErrorResponse("chatId param is missing", 400));
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    res
      .status(200)
      .json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};
