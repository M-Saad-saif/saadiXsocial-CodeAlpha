const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("./config/cloudinary");

const app = express();
ConnectDB();

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "auth-token"],
//   }),
// );

app.use(cors());
// middleware to parse into json
app.use(express.json());

app.use("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "backend is running successfully" });
});

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/post", require("./routes/postRoute"));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`saadiXsoxials is ruunning at http://localhost:${port}`);
});
