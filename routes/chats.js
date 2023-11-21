const express = require("express");
const { protect } = require("../middleware/auth");
const { accessCreateChat, getChats } = require("../controllers/chats");
const router = express.Router();

router.post("/", protect, accessCreateChat);
router.get("/", protect, getChats);

module.exports = router;
