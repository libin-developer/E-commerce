import mongoose from "mongoose";

const adminschema =new mongoose.Schema(
    {
    adminname:{
        type:String,
        required:true,
        unique:true,
        minLength: 3,
        maxLength: 10
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength: 3,
        maxLength: 20
    },
    hashpassword:{
        type:String,
        required:true,
        minLength: 6
    },
    role:{
        type:String,
        required:true,
        enum: ["admin"],
    }

})

const Admin =mongoose.model("Admin",adminschema);
export default Admin;