const express = require('express');
const { getUsers } = require('../controllers/adminController');
const router = express.Router();

// Define routes
router.get('/', getUsers);

module.exports = router;
