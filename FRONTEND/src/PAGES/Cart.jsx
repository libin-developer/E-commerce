import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button, Grid, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';




const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
   

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/${userId}`,{withCredentials:true});
                setCart(response.data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                setError('Failed to fetch cart. Please try again later.');
            }
        };

        if (userId) {
            fetchCart();
        } else {
            setError('User not logged in.');
        }
    }, [userId]);

    const handleClearCart = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/clear/${cart._id}`,{withCredentials:true});

            if (response.status === 200) {
                setCart(response.data.cart); // Update cart state with the cleared cart
                toast.success('Cart cleared successfully');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart. Please try again.');
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/create-order`, {
                amount: cart.totalAmount,
                currency: 'INR',
            },{withCredentials:true});

            const { orderId } = response.data;
           
          

            const options = {
                key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: cart.totalAmount * 100, // Convert to paise
                currency: 'INR',
                name: 'E-Commerce App',
                description: 'Payment for your cart',
                order_id: orderId,
                handler: async function (response) {
                    try {
                        await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/capture-payment`, {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            amount: cart.totalAmount,
                            userId,
                            productDetails: cart.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            })), // Pass product details with quantities
                            paymentStatus: 'captured', // Set status as 'captured'
                        },{withCredentials:true});
                        toast.success('Payment successful!');
                        await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}cart/clear/${cart._id}`,{withCredentials:true});
                        navigate('/home/payment-status/success');
                    } catch (error) {
                        console.error('Error capturing payment:', error);
                        toast.error('Payment failed. Please try again.');
                    }
                },
                modal: {
                    ondismiss: function() {
                        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/capture-payment`, {
                            paymentId: null,
                            orderId: orderId,
                            amount: cart.totalAmount,
                            userId,
                            productDetails: cart.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            })), // Pass product details with quantities
                            paymentStatus: 'pending', // Set status as 'pending' if payment is not completed
                        },{withCredentials:true})
                        toast.error("Payment pending .please try again")
                        .catch(error => {
                            console.error('Error saving pending payment status:', error);
                            toast.error('Failed to save payment status. Please try again.');
                        });
                    }
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
                
                }}
            >
                <Typography variant="h4" sx={{ mb: 2,color:"yellowgreen"}}>
                    Your cart is empty.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
                    Go to Shop
                </Button>
            </Container>
        );
    }

    return (
        <>
            <CssBaseline />
            <Container sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ mt: 4, fontFamily: 'fantasy', color: 'salmon' }}>
                        Your Cart
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {cart.items.map(item => (
                            <Grid item xs={12} md={6} lg={4} key={item.productId}>
                                <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#fff' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <Box>
                                            <Typography variant="h6">{item.productName}</Typography>
                                            <Typography>Price: ₹{item.price}</Typography>
                                            <Typography>Quantity: {item.quantity}</Typography>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1 }}
                                                onClick={handleClearCart}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007bff', mb: 1 }}>
                        Total Amount: ₹{cart.totalAmount}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePayment} 
                        sx={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',cursor:'pointer' }}
                    >
                        Pay Now
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default CartPage;
