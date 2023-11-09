const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create User
    const user = await User.create({ name, email, password });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else {
      console.log(error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }
};
