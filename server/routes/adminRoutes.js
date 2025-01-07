const express = require("express");
const { getAllAdmins, createAdmin } = require("../controllers/adminController");

const router = express.Router();

// Get all admins
router.get("/", getAllAdmins);

// Create a new admin
router.post("/", createAdmin);

module.exports = router;
