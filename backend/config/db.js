const mongoose = require("mongoose");

const ConnectDB = async () => {
  const mongooDB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/saadixsocials";
  try {
    await mongoose.connect(mongooDB_URI);
    const host = mongoose.connection.host;
    if (host.includes("mongodb.net")) {
      console.log("connect to mongoDB (Atlas)");
    } else {
      console.log("connect to mongoDB (local)");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = ConnectDB
