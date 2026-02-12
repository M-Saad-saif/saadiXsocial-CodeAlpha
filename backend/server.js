const express = require("express");
const app = express();

app.use("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "backend is running successfully" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`saadiXsoxials is ruunning at http://localhost:${port}`);
});
