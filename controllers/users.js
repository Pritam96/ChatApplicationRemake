const User = require("../models/User");

// GET => /api/v1/auth/users?search=example
exports.getUsers = async (req, res, next) => {
  const keyword = req.query.search;
  try {
    let users;
    if (!keyword) {
      users = await User.find({ _id: { $ne: req.user._id } });
    } else {
      users = await User.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).find({ _id: { $ne: req.user._id } });
    }

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};
