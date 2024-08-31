import mongoose from "mongoose"
import Product from "./productsmodel.js";

const sellerscheme = new mongoose.Schema(
    {
        sellername:{
            type:String,
            required:true,
            unique:true,
            minLength: 3,
            maxLength: 15,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30
        },
        hashpassword:{
            type:String,
            required:true,
            minLength: 6
        },
        role:{
            type:String,
            enum: ["seller"]
        },
          productNames: [Product.schema.obj.productname]
            
        
    },
)
const Seller =mongoose.model("Seller",sellerscheme);

export default Seller;