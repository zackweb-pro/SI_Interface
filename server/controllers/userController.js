const User = require('../models/userModel');

async function getUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

module.exports = { getUsers };
