import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  CssBaseline,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const theme = useTheme(); // Get theme to adjust colors in dark mode

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/${userId}`,
          { withCredentials: true }
        );
        setCart(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setError('Failed to fetch cart. Please try again later.');
        window.location.reload();
      }
    };

    if (userId) {
      fetchCart();
    } else {
      setError('User not logged in.');
    }
  }, [userId]);

  const handleRemoveProduct = async (itemId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/remove-item/${cart._id}/${itemId}`,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setCart(response.data.cart); // Update cart state after successful removal
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove product. Please try again.');
    }
  };

  const handleQuantityChange = async (productId, quantityChange) => {
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantityChange;

      if (newQuantity < 1) {
        return;
      }

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/update-quantity/${cart._id}/${existingItem._id}`,
          { quantity: newQuantity },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setCart(response.data.cart);
        } else {
          toast.error(response.data.message || 'Failed to update quantity. Please try again.');
        }
      } catch (error) {
        console.error('Error updating quantity:', error.response ? error.response.data : error);
        toast.error(error.response?.data.message || 'Failed to update quantity. Please try again.');
      }
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/create-order`,
        { amount: cart.totalAmount, currency: 'INR' },
        { withCredentials: true }
      );

      const { orderId } = response.data;

      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: cart.totalAmount * 100,
        currency: 'INR',
        name: 'E-Commerce App',
        description: 'Payment for your cart',
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/capture-payment`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: cart.totalAmount,
                userId,
                productDetails: cart.items.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
                paymentStatus: 'captured',
              },
              { withCredentials: true }
            );
            toast.success('Payment successful!');
            navigate('/payment-status/success');
          } catch (error) {
            console.error('Error capturing payment:', error);
            toast.error('Payment failed. Please try again.');
          }
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment was dismissed. Please try again.');
          },
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment. Please try again.');
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url("https://images.pexels.com/photos/20943/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
          Your cart is empty🙂
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go to Shop
        </Button>
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
      <Container
       sx={{
        minHeight: 'calc(100vh - 64px)',
        py: 4,
        backgroundImage: 'url("https://images.pexels.com/photos/5868127/pexels-photo-5868127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: {
          xs: 'center', // For small screens and up
          sm: 'center', // For medium screens and up
          lg: 'unset',  // For large screens, no backgroundPosition needed
        },
      }}
      
      >
        <Typography variant="h4" sx={{ mb: 4, color: 'white', fontFamily:"cursive"}}>
          My Cart
        </Typography>
        <Grid container spacing={2}>
          {cart.items.map(item => (
            <Grid item xs={6} sm={4} md={3} key={item._id}>
              <Paper elevation={3} sx={{ p: 1, background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
                <img
                  src={item.image}
                  alt={item.productName}
                  style={{ width: '100%', maxHeight: '80px', objectFit: 'contain' }} // Smaller image
                />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontSize: '0.85rem' }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Price: ₹{item.price}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Quantity: {item.quantity}
                  </Typography>
                  <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      sx={{ minWidth: '30px', padding: '4px' }} // Smaller button
                    >
                      -
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      sx={{ minWidth: '30px', padding: '4px' }} // Smaller button
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    size="small"
                    sx={{ mt: 1, fontSize: '0.75rem' }} // Smaller remove button
                    onClick={() => handleRemoveProduct(item._id)}
                  >
                    Remove From Cart
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 3,
            maxWidth: '400px',
            mx: 'auto',
            background: theme.palette.mode === 'dark' ? '#333' : '#fff', // Change based on dark mode
            color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Adjust text color
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total Amount: ₹{cart.totalAmount}
          </Typography>
          <Button variant="contained" color="success" fullWidth onClick={handlePayment}>
            Proceed to Pay
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default CartPage;
