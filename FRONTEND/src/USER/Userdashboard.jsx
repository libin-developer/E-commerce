import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate } from "../../uTILS/formdate";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [currentTab, setCurrentTab] = useState('profile');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
        fetchTransactionHistory();
    }, []);

    const fetchTransactionHistory = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error("User not logged in.");
            }
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}payment/transactions/${userId}`, {
                withCredentials: true
            });
            setTransactionHistory(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transaction history:', error);
        }
    };

    const logout = async () => {
        try {
            // Make the request to the backend API to log the user out
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/logout`,
                {},
                { withCredentials: true }
            );
    
            if (response.data.success) {
                // Remove cookies and localStorage items related to user session
                localStorage.clear();
    
                toast.success("You have been logged out");
                navigate("/signin");
                window.location.reload();
            } else {
                toast.error(response.data.message || "Failed to log out");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred while logging out.");
        }
    };
    

    const onForgetPassword = () => {
        navigate("/signin/forgetpassword");
    };

    const handleDeleteUser = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const deleteuser = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/delete-account/${userId}`, {
                withCredentials: true
            });
            if (deleteuser.data.success) {
                localStorage.removeItem("username");
                localStorage.removeItem("userId");
                localStorage.removeItem("email");
                navigate("/signin");
                toast.success(deleteuser.data.message);
            } else {
                toast.error(deleteuser.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete account.');
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'profile':
                return (
                    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <Typography variant="h4" className="text-gray-800 dark:text-white mb-4 font-bold">Profile Information</Typography>
                        <CardContent>
                            <Box className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
                                <Typography className="text-gray-700 dark:text-slate-50 font-medium">Username:</Typography>
                                <Typography className="text-xl text-gray-900 dark:text-white font-bold">{username}</Typography>
                            </Box>
                            <Box className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <Typography className="text-gray-700 dark:text-slate-50 font-medium">Email Address:</Typography>
                                <Typography className="text-lg text-gray-900 dark:text-white font-bold">{email}</Typography>
                            </Box>
                            <div className="flex flex-col mt-6 space-y-2">
                                <Button onClick={onForgetPassword} variant="contained" color="primary">Forget Password</Button>
                                <Button onClick={() => setOpenDeleteDialog(true)} variant="contained" color="error">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 'orders':
                return (
                    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <Typography variant="h4" className="text-gray-800 dark:text-white mb-4 font-bold">Order History</Typography>
                        <List>
                            {transactionHistory.length > 0 ? (
                                transactionHistory
                                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort transactions by date, latest first
                                    .map((transaction) => (
                                        <ListItem key={transaction._id} className="dark:bg-gray-800">
                                            <ListItemText
                                                primary={`Transaction ID: ${transaction._id}`}
                                                secondary={
                                                    <>
                                                        {transaction.products.map((product) => (
                                                            <Typography key={product.productId} component="span" className="block text-gray-700 dark:text-white">
                                                                Product: {product.productName} (Qty: {product.quantity})
                                                            </Typography>
                                                        ))}
                                                        <Typography component="span" className="block text-gray-700 dark:text-white">
                                                            Order ID: {transaction.orderId}
                                                        </Typography>
                                                        <Typography component="span" className="block text-gray-700 dark:text-white">
                                                            Amount: ₹{transaction.amount}
                                                        </Typography>
                                                        <Typography component="span" className="block text-gray-700 dark:text-white">
                                                            Status: {transaction.status}
                                                        </Typography>
                                                        <Typography component="span" className="block text-gray-700 dark:text-white">
                                                            Date: {formatDate(transaction.date)}
                                                        </Typography>
                                                    </>
                                                }
                                                primaryTypographyProps={{ className: 'text-gray-900 dark:text-white' }}
                                                secondaryTypographyProps={{ className: 'text-gray-700 dark:text-white' }}
                                            />
                                        </ListItem>
                                    ))
                            ) : (
                                <ListItem className="dark:bg-gray-800">
                                    <ListItemText primary="No transactions found." primaryTypographyProps={{ className: 'text-gray-900 dark:text-white' }} />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                );
            default:
                return (
                    <Box className="flex flex-col items-center justify-center p-6">
                        <div className="relative">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/007/350/756/non_2x/word-on-billboard-free-photo.jpg"
                                alt="E-commerce Ad"
                                className="max-w-full h-auto mb-4"
                            />
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/seller')}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white border border-white rounded-lg transition-shadow duration-300 hover:shadow-glow hover:bg-transparent hover:border-blue-400 hover:text-blue-400"
                                style={{
                                    backgroundColor: 'transparent',
                                    borderWidth: '1px',
                                    borderColor: 'white',
                                    padding: '8px 24px',
                                }}
                            >
                                Sell Your Products
                            </Button>
                        </div>
                    </Box>
                );
        }
    };

    return (
        <Box className="min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar for User Dashboard */}
            <Box className="w-full lg:w-1/3 bg-gray-100 dark:bg-gray-900 p-4">
                <Typography variant="h4" className="text-gray-800 dark:text-white mb-4 font-bold">DashBoard</Typography>
                <div className="flex flex-col space-y-4">
                    <Button
                        variant="contained"
                        onClick={() => setCurrentTab('profile')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-shadow duration-300"
                    >
                        My Profile
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setCurrentTab('orders')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-shadow duration-300"
                    >
                        My Orders
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenLogoutDialog(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-shadow duration-300"
                    >
                        Logout
                    </Button>
                </div>

                {/* E-commerce Ad Section */}
                <Box className="mt-8 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                    <div className="relative">
                        <img
                            src="https://th.bing.com/th/id/OIP.tkruWvOsRXYNAo1kK-R5kQHaD4?rs=1"
                            alt="Ad"
                            className="w-full h-auto mb-4 rounded-lg"
                        />
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => navigate('/seller')}
                            className=" center text-white border border-white rounded-lg transition-shadow duration-300 hover:shadow-glow hover:bg-transparent hover:border-yellow-400"
                        >
                            Sell Your Products
                        </Button>
                    </div>
                </Box>
            </Box>

            {/* Main Content Section */}
            <Box className="flex-grow p-4">{renderContent()}</Box>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Logout Confirmation Dialog */}
            <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={logout} color="error">Logout</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserDashboard;
