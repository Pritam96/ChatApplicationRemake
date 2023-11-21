const Chat = require("../models/Chat");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// POST => /api/v1/auth/chats <= userId
exports.accessCreateChat = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new ErrorResponse("userId param missing", 400));
  }

  try {
    const chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        {
          members: { $eq: req.user._id },
        },
        {
          members: { $eq: userId },
        },
      ],
    })
      .populate("members", "-password")
      .populate("latestMessage");

    // console.log("CHAT", chat);

    // populating certain fields under latestMessage(Message model)
    const chatDetails = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    console.log("CHAT DETAILS WITH LATEST MESSAGE", chatDetails);

    if (chatDetails) {
      res.status(200).json({ success: true, data: chatDetails });
    } else {
      const newChat = await Chat.create({
        members: [req.user._id, userId],
      });

      const chat = await Chat.findById(newChat._id).populate(
        "members",
        "-password"
      );

      console.log("NEWLY CREATED CHAT WITH LATEST MESSAGE", chat);

      res.status(200).json({ success: true, data: chat });
    }
  } catch (error) {
    next(error);
  }
};

// GET => /api/v1/auth/chats
exports.getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: { $eq: req.user._id } })
      .populate("members", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const chatsInDetails = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });

    res
      .status(200)
      .json({ success: true, count: chats.length, data: chatsInDetails });
  } catch (error) {
    next(error);
  }
};
