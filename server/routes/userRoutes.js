const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus } = require("../controllers/userController");

router.get("/", getAllUsers);
router.put("/:id/status", toggleUserStatus);

module.exports = router;
