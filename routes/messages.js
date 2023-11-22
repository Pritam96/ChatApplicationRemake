const express = require("express");
const { protect } = require("../middleware/auth");
const { sendMessage, getMessages } = require("../controllers/messages");
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);

module.exports = router;
