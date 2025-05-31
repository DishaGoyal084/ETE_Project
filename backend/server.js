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
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/auth", authRoutes);
app.use("/api", examinerRoutes);
app.use("/student",studentRoutes);
app.use("/admin",adminRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
