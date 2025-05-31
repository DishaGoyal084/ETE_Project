const User = require("../models/User"); 
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
};

// const ensureExaminer = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) return res.status(401).json({ message: "Unauthorized: No Token Provided" });
  
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id);  
  
//       if (!user || user.role !== "examiner") {
//         return res.status(403).json({ message: "Access Denied: Examiners Only" });
//       }
  
//       req.user = user;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid Token" });
//     }
// };




const ensureExaminer = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "Unauthorized: No Token Provided" });
        }

        console.log("🔍 Token received:", token);  

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);  

        const user = await User.findById(decoded._id);
        if (!user) {
            console.log("❌ User not found for ID:", decoded.id);
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "examiner") {
            console.log("❌ User is not an examiner:", user.role);
            return res.status(403).json({ message: "Access Denied: Examiners Only" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("❌ Error verifying token:", err.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};


const ensureStudent = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("000000000000"+decoded.role);
        if (decoded.role !== "student") throw new Error("Unauthorized role");

        req.user = decoded;  
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Authentication failed" });
    }
};

const ensureAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admins Only" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("❌ Admin token error:", err.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports ={
    ensureAuthenticated,
    ensureExaminer,
    ensureStudent,
    ensureAdmin
};