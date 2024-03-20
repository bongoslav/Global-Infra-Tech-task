import mongoose from "mongoose";
require("dotenv").config();

const uri = process.env.MONGO_DB_LOCAL_URI!;

mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", (error: Error) => {
  console.log("❌ MongoDB connection error:", error);
});

db.on("connected", () => {
  console.log("🔌 MongoDB connected...");
});
