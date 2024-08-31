import mongoose from "mongoose";
import { cloudinaryInstance } from "../Config/cloudinaryconfig.js";
import Product from "../DBmodels/productsmodel.js";
import Seller from "../DBmodels/sellermodel.js";
import Review from "../DBmodels/reviewmodel.js";
import User from "../DBmodels/usermodel.js";
import Payment from "../DBmodels/paymentmodel.js";

// GET /api/products/:sellerId
export const sellerproducts = async (req, res) => {
  const sellerId = req.params.sellerId;

  try {
    // Check if sellerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid seller ID', success: false });
    }

    // Fetch products by sellerId
    const products = await Product.find({ sellerId: sellerId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller', success: false });
    }

    res.status(200).json({ message: "Products fetched successfully", products, success: true });
  } catch (error) {
    console.error('Error fetching products by seller ID:', error);
    res.status(500).json({ message: 'Error fetching products', success: false });
  }
};



//add product

export const addproduct =async(req,res)=>{
    
        
    try {
            if(!req.file) {
            return res.send({message:"file is not visible",success:false})
            }
            cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
              console.log(err, "error");
              return res.status(401).json({success: false,message: "Error",});
            }
            console.log("result",result)
            
            const imageUrl = result.url;
            const body =req.body;
            console.log(body,"body");
            
        const {productname, description, catogery,price,stock,image} =req.body
        const sellerId =await Seller.findById(req.params.id)
        if(!sellerId){
            return res.status(401).send({message:"seller not found",success:false})
        }
        const product =await Product.findOne({productname})
        if(product){
           console.log("product already exist")
           return res.status(401).send({message:"product already already exist",success:false})
        }
        const createproduct =new Product({
            productname,
            description,
            catogery,
            price,
            stock,
            sellerId,
            image:imageUrl,
        })
       
        await createproduct.save();
        
        sellerId.productNames.push(createproduct)
        sellerId.save()
        console.log("product added successfully")
        return res.status(200).json({message:"product added successfully",createproduct,success:true})
    });
    } catch (error) {
        console.log("product add failed",error)
        return res.status(500).send({message:"product add failed",error,success:false})
    }

}

/// get product

export const getproduct =async(req,res)=>{

    // try {
        // const findproducts =await Product.find();
        // if(!findproducts){
        //     res.status(401).send("products not found")
        // }
        // return res.json({message:"products",findproducts})
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  try {
    const products = await Product.find().skip(startIndex).limit(limit);
    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }

      

    // } catch (error) {
    //     console.log("product get failed",error)
    //     return res.status(500).send("product get failed",error)

    // }
}

// update product

export const updateProduct = async (req, res) => {
    
    try {
      
        const {id} =req.params
        const {productname,description,catogery,price,stock} = req.body
        const updatep = await Product.findByIdAndUpdate(id,{productname,description,catogery,price,stock},{ new: true, runValidators: true });
  
      if (!updatep) {
        console.log("product not found")
        return res.status(404).send({message:"Product not found",success:false});
      }
      // update image ... future scope
      
      console.log("product updated successfully");
      return res.status(200).json({message:"updated product",updatep,success:true});
    } catch (err) {
      console.log("failed product update",err)
      return res.status(400).json({ message:"something error",success:false });
    }
  };


//remove product

export const removeproduct =async (req,res)=>{
    try {
        const id =req.params.id
        const deleteproduct =await Product.deleteOne({_id:id});
        if(!deleteproduct){
            console.log("product can not be fond")
            return res.status(401).json({message:"product can not be found",success:false})
        }
        console.log("product removed successfully")
        return res.status(200).json({message:"product removed successfully",success:true})
    } catch (error) {
        console.log("product remove failed",error)
        return res.status(500).json({message:"product remove failed",error,success:false})
    }
}

// total products for seller

export const totalproducts =async (req,res)=>{

    try {
       const sellerId =req.params.sellerId
        const total =await Product.countDocuments({sellerId})
        res.status(200).json({message:"total products",total})
    } catch (error) {
        console.log("product count failed",error)
        return res.status(500).send("product count failed",error)
 
    }
}
//get-product by id

export const productid =async (req,res)=>{

  try{
    const product = await Product.findById(req.params.id).populate('sellerId', 'sellername');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
  
  }
  res.json(product)
}catch{
    res.status(500).json({ message:"product fetching failed"});
  }
}

//search product

export const searchproducts =async(req,res)=>{
  try {
    const { q } = req.query;
    const products = await Product.find({
    productname: { $regex: q, $options: 'i' } // Case-insensitive search
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

// total products

export const Totalstatus =async(req,res)=>{
  try {
    const [totalProducts, totalReviews,totalOrders,totalSellers, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Review.countDocuments(),
      Payment.countDocuments({ status: 'captured' }),
      Seller.countDocuments(),
      User.countDocuments(),
    ]);

    // Send response with all stats
    res.json({message:'all stats',
      totalProducts,
      totalReviews,
      totalOrders,
      totalSellers,
      totalUsers,
      success:true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}


//Totalreview each seller

export const countReviewsBySellerId = async (req, res) => {
  const { sellerid } = req.params;

  try {
    const reviewCount = await Product.aggregate([
      { $match: { sellerId:new mongoose.Types.ObjectId(sellerid) } }, // Match the sellerId
      { $unwind: '$reviews' }, // Unwind the reviews array
      { $count: 'totalReviews' } // Count the number of reviews
    ]);

    // If no reviews are found, set the count to zero
    const totalReviews = reviewCount.length > 0 ? reviewCount[0].totalReviews : 0;

    res.status(200).json({ totalReviews });
  } catch (error) {
    res.status(500).json({ message: 'Error counting reviews', error: error.message });
  }
};