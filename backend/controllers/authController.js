const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;  
    const user = await UserModel.findOne({ email });

    const errorMsg = "Auth failed: Email or password is incorrect";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
      role: user.role 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { signup, login };
