import Review from "../DBmodels/reviewmodel.js"
import Product from "../DBmodels/productsmodel.js"

// addreview

export const addReview = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' , success:false})
      }
      const reviews = await Review.findById(req.params.id)
    
      const newreview = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        reviewer: req.body.reviewer,
        productid:req.params.id
      })
  
      product.reviews.push(newreview);
      const updatedProduct = await product.save();
      const updatereview = await newreview.save()
      
      console.log("saved in review",updatereview)
      res.status(201).json({message:"review added successfully",updatedProduct,success:true});
    } catch (err) {
      res.status(400).json({ message:"seomthing error", success:false});
    }
  };

  
