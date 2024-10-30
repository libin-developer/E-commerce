import mongoose from "mongoose";

const reviewschema =new mongoose.Schema({

    comment:{
        type:String,
        required:true,
        trim:true
    },
    reviewer:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const Review = mongoose.model("Review",reviewschema);
export default Review