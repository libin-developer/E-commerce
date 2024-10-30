import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, Paper, Rating, Typography, useTheme } from '@mui/material';
import { HiShoppingCart } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ReviewForm from "./Addreview"; // Component for adding a review

const ProductDetails = () => {
  const theme = useTheme(); // Access MUI theme for dynamic styling
  const { id } = useParams(); // Extract product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [editMode, setEditMode] = useState(false); // For editing review
  const [currentReview, setCurrentReview] = useState(null); // Holds review data to edit
  const userId = localStorage.getItem('userId'); // Get the logged-in user's ID
  const reviewFormRef = useRef(null); // Ref for the review form

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/product/${id}`);
        if (response.data) {
          setProduct(response.data);
          setError(null);
        } else {
          setError('No product details available');
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setError('Failed to fetch product details. Please try again later.');
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!userId || userId.length !== 24) {
        toast.error("Please log in first.");
        navigate("/signin");
        return;
      }
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/add-cart`, {
        userId,
        productId: product._id,
        quantity,
      }, { withCredentials: true });
      navigate("/cart");
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast.error('Failed to add product to cart. Please try again.');
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}review/delete/${product._id}/${reviewId}/${userId}`, { withCredentials: true });
      if (response.data.success) {
        toast.success('Review deleted successfully');
        setProduct((prevProduct) => ({
          ...prevProduct,
          reviews: prevProduct.reviews.filter(review => review._id !== reviewId),
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete review. Please try again later.');
    }
  };

  // Handle Edit Review Mode
  const handleEditReview = (review) => {
    setCurrentReview(review);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentReview(null);
  };

  // Scroll to Review Form
  const handleScrollToReviewForm = () => {
    reviewFormRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Sort reviews by date (latest first)
  const sortedReviews = product?.reviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (error) {
    return (
      <Container>
        <Typography variant="h4" color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {/* Product Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row md:max-w-4xl mx-auto">
          {/* Product Image */}
          <div className="md:w-1/2 flex justify-center items-center bg-gray-200 dark:bg-gray-700">
            <img
              src={product.image}
              alt={product.productname}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <Typography variant="h4" className="text-gray-800 dark:text-white mb-2">
              {product.productname}
            </Typography>
            {product.stock > 0 ? (
              <Typography variant="subtitle1" className="text-green-500">In Stock</Typography>
            ) : (
              <Typography variant="subtitle1" className="text-red-500">Out of Stock</Typography>
            )}
            <Typography variant="h6" className="text-gray-700 dark:text-gray-300 mb-4">
              Price: ₹{product.price}
            </Typography>
            <Button onClick={handleDecrement} disabled={quantity === 1}>-</Button>
            <Typography className='dark:text-gray-300'>{quantity}</Typography>
            <Button onClick={handleIncrement} disabled={quantity >= product.stock}>+</Button>
            <Button
              startIcon={<HiShoppingCart />}
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{ mt: 2 }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Reviews Section */}
        <Button variant="contained" color="success" sx={{mt:4, color:"white"}} onClick={handleScrollToReviewForm}>
          Post Your Review
        </Button>
        <Typography
          variant="h5"
          sx={{
            mt: 4,
            mb: 2,
            color: 'green',
          }} 
          className='dark:text-gray-300'
        >
          Customer Reviews
        </Typography>
        {sortedReviews.map(review => (
          <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">{review.reviewerName}</Typography>
            <Rating value={review.rating} readOnly />
            <Typography variant="body2">{review.comment}</Typography>
            {userId === review.reviewer && (
              <>
                <Button onClick={() => handleEditReview(review)}>Edit</Button>
                <Button onClick={() => handleDeleteReview(review._id)}>Delete</Button>
              </>
            )}
          </Paper>
        ))}
        
        {/* Add/Edit Review Form */}
        <Box ref={reviewFormRef}> {/* Attach ref here */}
          <ReviewForm
            productId={product._id}
            editMode={editMode}
            currentReview={currentReview}
            onCancelEdit={handleCancelEdit}
            onUpdate={(updatedReview) => {
              setProduct((prevProduct) => ({
                ...prevProduct,
                reviews: prevProduct.reviews.map((review) =>
                  review._id === updatedReview._id ? updatedReview : review
                ),
              }));
              setEditMode(false);
              setCurrentReview(null);
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetails;
