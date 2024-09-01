import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, ButtonGroup, Container, Paper, Rating, Typography } from '@mui/material';
import { HiShoppingCart } from 'react-icons/hi'; // Importing HiShoppingCart icon
import { formatDate } from "../../uTILS/formdate";
import ReviewForm from './Addreview'; // Component for adding a review
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams(); // Extract product ID from URL
  const navigate = useNavigate(); // Use for navigation
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/product/${id}`);
        setProduct(response.data);
        setError(null);
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
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
      if (!userId || userId.length !== 24) { // 24 is the length of a MongoDB ObjectId
        throw new Error("Invalid user ID");
      }
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/add-cart`, {
        userId,
        productId: product._id,
        quantity,
      },{withCredentials:true});
      navigate("/home/cart"); // Navigate to the cart page
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast.error('Failed to add product to cart. Please try again.');
    }
  };
  
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
            {/* Conditionally Render Stock Information */}
            {product.stock > 0 ? (
              <Typography variant="h6" className="text-gray-600 dark:text-gray-400 mb-4">
                Stock: {product.stock}
              </Typography>
            ) : (
              <Typography variant="h6" color="error" className="mb-4">
                Out of Stock
              </Typography>
            )}
            <Typography variant="h6" className="font-bold text-gray-800 dark:text-gray-300 mb-4">
              Price: ₹{product.price}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ButtonGroup disableElevation variant="contained" aria-label="Quantity control buttons">
                  <Button onClick={handleDecrement} disabled={quantity === 1}>-</Button>
                  <Button sx={{ backgroundColor: 'grey' }}>Qty: {quantity}</Button>
                  <Button onClick={handleIncrement} disabled={quantity >= product.stock}>+</Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  endIcon={<HiShoppingCart />} // Adding HiShoppingCart icon
                  disabled={product.stock <= 0} // Disable button if out of stock
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>

            <Typography variant="h6" className="text-2xl mb-2 mt-8 text-gray-800 dark:text-white">
              Product Details
            </Typography>
            <ul className="font-serif mb-6 font-medium text-gray-600 dark:text-gray-400">
              <li>{product.description}</li>
              <li>Seller: {product.sellerId.sellername}</li>
            </ul>
          </div>
        </div>
      
        {/* Product Reviews */}
        <Box sx={{ mt: 4 }}>
          <ReviewForm productId={product._id} />
          <Typography variant="h5" gutterBottom className="dark:text-white">
            Reviews
          </Typography>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: 2,
                  mb: 2,
                  backgroundColor: 'white',
                  dark: { backgroundColor: 'rgba(55, 65, 81, 1)' } // Tailwind's gray-700
                }}
              >
                <Typography variant="subtitle1" className="dark:text-gray-300">
                  {review.author}
                </Typography>

                <Typography variant="subtitle2" className="dark:text-gray-500">
                  {formatDate(review.date)}
                </Typography>

                <Typography variant="body1" gutterBottom className="dark:text-gray-500">
                  {review.comment}
                </Typography>

                <Rating
                  name={`review-rating-${index}`}
                  value={review.rating}
                  readOnly
                  precision={0.5}
                />
              </Paper>
            ))
          ) : (
            <Typography className="dark:text-white">No reviews yet.</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetails;
