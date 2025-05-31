const express = require('express');
const router = express.Router();
const User=require("../models/User");
const {ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const { adminDashboard, adminUsers } = require('../controllers/adminController');
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'super-secret-key';

require('dotenv').config();

router.post('/protected-route', ensureAuthenticated, (req, res) => {
    res.json({ message: "You have access!", user: req.user });
});

console.log({ adminDashboard, adminUsers });

router.post('/verify-access-key', ensureAdmin, (req, res) => {
  const { accessKey } = req.body;
  if (accessKey === ADMIN_ACCESS_KEY) {
    return res.status(200).json({ message: 'Access granted' });
  }
  return res.status(401).json({ message: 'Invalid access key' });
});

router.get('/dashboard', ensureAdmin, adminDashboard);


router.get('/users', ensureAdmin, adminUsers);

router.get('/user-stats', ensureAdmin, async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'student' });
    const examiners = await User.countDocuments({ role: 'examiner' });

    res.status(200).json({ students, examiners });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
