import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 15,

    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20,
    },
    hashpassword: {
      type: String,
      required: true,
      minLength: 6,
    },
    role:{
      type:String,
      enum: ["user"],
    },
    
    
  }
);
const User = mongoose.model("User", userSchema);

export default User;