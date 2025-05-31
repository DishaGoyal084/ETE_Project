const User = require('../models/User');  

const adminDashboard = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    success: true,
  });
};




const adminUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json({
      message: "List of all users",
      success: true,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  adminDashboard,
  adminUsers,
};
