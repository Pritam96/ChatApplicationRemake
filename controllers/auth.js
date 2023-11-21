const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// POST => /api/v1/auth/register <= name, email, password
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create User
    const user = await User.create({ name, email, password });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// POST => /api/v1/auth/login <= email, password
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password.", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials.", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials.", 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// GET => /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
