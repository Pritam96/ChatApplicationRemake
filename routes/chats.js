const express = require("express");
const { protect } = require("../middleware/auth");
const {
  accessCreateChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chats");
const router = express.Router();

router.post("/", protect, accessCreateChat);
router.get("/", protect, getChats);

router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroupChat);
router.put("/add", protect, addToGroup);
router.put("/remove", protect, removeFromGroup);

module.exports = router;
