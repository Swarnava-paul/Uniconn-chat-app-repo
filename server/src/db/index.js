import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { DB_NAME } from "../constants.js";

 async function connectDB () {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log('connection with Database is successful');
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
