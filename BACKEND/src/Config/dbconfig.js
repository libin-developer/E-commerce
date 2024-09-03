import mongoose from "mongoose";
import serverconfig from "../Config/serverconfig.js";
<<<<<<< HEAD


=======
>>>>>>> 1c56ffdf8480ae55ca2f33ac491e184e611f29ee





console.log(serverconfig.mongodburl);

export const connect = async () => {
  try {
    await mongoose.connect(serverconfig.mongodburl);
    console.log("mongodb connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
