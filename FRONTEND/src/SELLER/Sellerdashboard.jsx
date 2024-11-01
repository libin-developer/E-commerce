import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../uTILS/Removecookies';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

export function Sellerdashboard() {
    const navigate = useNavigate();
    const [sellername, setSellername] = useState('');
    const [email, setEmail] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storedSellername = localStorage.getItem('sellername');
        if (storedSellername) setSellername(storedSellername);

        const storedEmail = localStorage.getItem('email');
        if (storedEmail) setEmail(storedEmail);

        // Fetch total products and total reviews
        async function fetchStats() {
            try {
                const sellerId = localStorage.getItem('sellerId');
                const token = localStorage.getItem('token'); // Get the token from localStorage
                
                const productsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/${sellerId}/totalproducts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setTotalProducts(productsResponse.data.total);

                const reviewsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/reviews-count/${sellerId}`,{
                    withCredentials: true,
                });
                setTotalReviews(reviewsResponse.data.totalReviews);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        }

        fetchStats();
    }, []);

    const onForgetPassword = () => {
        deleteCookie();
        navigate("/seller/forgetpassword");
    };

    const handleDeleteUser = async () => {
        try {
            const id = localStorage.getItem("sellerId");
           
            const deleteuser = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}seller/delete-seller/${id}`, {
                withCredentials: true,
            });

            if (deleteuser.data.success) {
                localStorage.clear();
                navigate("/seller");
                toast.success(deleteuser.data.message);
            } else {
                toast.error(deleteuser.data.message);
            }
        } catch (error) {
            console.log("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
                <Typography variant="h4" align="center" gutterBottom className="text-gray-800 dark:text-white">
                    Dashboard
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Seller Name
                                </Typography>
                                <Typography variant="h5">
                                    {sellername}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Email Address
                                </Typography>
                                <Typography variant="h5">
                                    {email}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Total Products
                                </Typography>
                                <Typography variant="h5">
                                    {totalProducts}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Total Reviews
                                </Typography>
                                <Typography variant="h5">
                                    {totalReviews}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <div className="flex justify-between mt-6">
                    <Button
                        onClick={handleClickOpen}
                        variant="contained"
                        color="secondary"
                    >
                        Delete Account
                    </Button>
                    <Button
                        onClick={onForgetPassword}
                        variant="contained"
                        color="primary"
                    >
                        Forget Password
                    </Button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
