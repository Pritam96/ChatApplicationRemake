const User = require("../models/User");

// GET => /api/v1/auth/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};
