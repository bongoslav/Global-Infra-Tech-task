import mongoose from "mongoose";
require("dotenv").config();

const uri = process.env.MONGO_DB_URI!;

mongoose.connect(uri);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});
