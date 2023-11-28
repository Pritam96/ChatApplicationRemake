const Chat = require("../models/Chat");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// POST => /api/v1/auth/chats <= userId
exports.accessCreateChat = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new ErrorResponse("userId param is missing", 400));
  }

  try {
    let chat = await Chat.findOne({
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

    // populating certain fields under latestMessage(Message model)
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (chat) {
      res.status(200).json({ success: true, data: chat });
    } else {
      const newChat = await Chat.create({
        members: [req.user._id, userId],
      });

      const chat = await Chat.findById(newChat._id).populate(
        "members",
        "-password"
      );

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

// POST => /api/v1/auth/chats/group <= title, members array
exports.createGroupChat = async (req, res, next) => {
  if (!req.body.members || !req.body.title) {
    return next(new ErrorResponse("Please provide all the fields", 400));
  }

  let members = JSON.parse(req.body.members);
  if (members.length < 2) {
    return next(
      new ErrorResponse("minimum three users required to form a group", 400)
    );
  }

  members.push(req.user);

  try {
    const chat = await Chat.create({
      title: req.body.title,
      isGroupChat: true,
      admin: req.user,
      members: members,
    });

    const chatDetails = await Chat.findById(chat._id)
      .populate("members", "-password")
      .populate("admin", "-password");

    res.status(200).json({ success: true, data: chatDetails });
  } catch (error) {
    next(error);
  }
};

// PUT => /api/v1/auth/chats/rename <= chatId, title
exports.renameGroupChat = async (req, res, next) => {
  const { chatId, title } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        title,
      },
      {
        new: true,
      }
    )
      .populate("members", "-password")
      .populate("admin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse("chat not found", 400));
    } else {
      res.status(200).json({ success: true, data: updatedChat });
    }
  } catch (error) {
    next(error);
  }
};

// PUT => /api/v1/auth/chats/add <= chatId, userId
exports.addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { members: userId },
      },
      {
        new: true,
      }
    )
      .populate("members", "-password")
      .populate("admin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse("chat not found", 404));
    } else {
      res.status(200).json({ success: true, data: updatedChat });
    }
  } catch (error) {
    next(error);
  }
};

// PUT => /api/v1/auth/chats/remove <= chatId, userId
exports.removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { members: userId },
      },
      {
        new: true,
      }
    )
      .populate("members", "-password")
      .populate("admin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse("chat not found", 404));
    } else {
      res.status(200).json({ success: true, data: updatedChat });
    }
  } catch (error) {
    next(error);
  }
};
