import mongoose from "mongoose";
require("dotenv").config();

let uri = process.env.MONGO_DB_LOCAL_URI!;

if (process.env.NODE_ENV === "test") {
  uri = process.env.TEST_MONGO_DB_LOCAL_URI!;
}

const connectDB = async () => {
  try {
    const db = await mongoose.connect(uri);
    console.log("🔌 MongoDB connected...");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectDB;
