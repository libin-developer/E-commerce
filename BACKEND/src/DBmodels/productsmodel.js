import mongoose from "mongoose"
import Review from "./reviewmodel.js"; 

const productschema = new mongoose.Schema(
    {
        productname:{
            type:String,
            required:true,
            trim:true,        //for removing the white space from both side of string
        },
        description:{
            type:String,
            required:true,
            trim:true,
        },
        catogery:{
            type:String,
            required:true,

        },
        price:{
            type:Number,
            required:true,
            min:0,
        },
        stock:{
            type:Number,
            required:true,
            min:0,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Seller
            ref: 'Seller',
            required: true,
          },
        image:{
            type:String,
            required:true,
        },
        reviews: [Review.schema]
    },{
        timestamps:true
    }
)

const Product =mongoose.model("Product",productschema);
export default Product;