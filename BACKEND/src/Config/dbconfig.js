import mongoose from "mongoose";
import serverconfig from "../../src/serverconfig.js";





console.log(serverconfig.mongodburl);

export const connect = async () => {
  try {
    await mongoose.connect(serverconfig.mongodburl);
    console.log("mongodb connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};