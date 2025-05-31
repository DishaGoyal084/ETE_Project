require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const authRoutes = require("./routes/authRoutes");
const examinerRoutes = require("./routes/examinerRoutes");
const studentRoutes=require("./routes/studentRoutes");
const adminRoutes=require("./routes/adminRoutes");
require("./models/db");

const PORT = process.env.PORT || 5000;

app.get("/ping", (req, res) => {
  res.send("PING");
});

app.use(cors({
  origin: "https://monumental-bonbon-0e776a.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // ✅ important for cookies/auth headers
}));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/auth", authRoutes);
app.use("/api", examinerRoutes);
app.use("/student",studentRoutes);
app.use("/admin",adminRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
