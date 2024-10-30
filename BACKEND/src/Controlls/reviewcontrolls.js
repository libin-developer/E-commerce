import Review from "../DBmodels/reviewmodel.js";
import Product from "../DBmodels/productsmodel.js";


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


// Edit Review Controller
export const editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { reviewerId, reviewId } = req.params;

    // Find and validate review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found', success: false });
    }

    // Authorization check
    if (review.reviewer.toString() !== reviewerId) {
      return res.status(403).json({ message: 'You are not authorized to edit this review', success: false });
    }

    // Update review fields
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Save the updated review
    const updatedReview = await review.save();

    // Update review in product reviews array if necessary
    const product = await Product.findById(review.productid);
    if (product) {
      const productReview = product.reviews.id(reviewId);
      if (productReview) {
        productReview.rating = rating || productReview.rating;
        productReview.comment = comment || productReview.comment;
        await product.save();
      }
    }

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview, success: true });
  } catch (err) {
    console.error("Error editing review:", err);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId, productId, userId } = req.params;

    // Find and validate the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found', success: false });
    }

    // Authorization check
    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this review', success: false });
    }

    // Find the product and validate its existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    // Debugging logs for clarity
    console.log("Review ID to delete:", reviewId);
    console.log("Product's Reviews array:", product.reviews);

    // Check if reviews are stored as object references or full objects, then find index accordingly
    const reviewIndex = product.reviews.findIndex(
      (review) => review.toString() === reviewId || (review._id && review._id.toString() === reviewId)
    );

    // If review is not in the product's reviews array, return an error
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found in product', success: false });
    }

    // Remove the review from the product's reviews array by index
    product.reviews.splice(reviewIndex, 1);

    // Delete the review from the Review collection
    await Review.findByIdAndDelete(reviewId);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Review deleted successfully", success: true });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

