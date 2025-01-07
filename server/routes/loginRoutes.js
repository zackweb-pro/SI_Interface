const express = require("express");
const { login } = require("../controllers/loginController");

const router = express.Router();

// Get all admins
router.post("/", login);


module.exports = router;
