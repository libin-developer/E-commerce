import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../uTILS/Removecookies';
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
    CardContent
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import {formatDate} from "../../uTILS/formdate"

const UserDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [open, setOpen] = useState(false);

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

    const onForgetPassword = () => {
        deleteCookie("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        navigate("/user/forgetpassword");
    };

    const handleDeleteUser = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const deleteuser = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/delete-account/${userId}`, {
                withCredentials: true
            });
            if (deleteuser.data.success) {
                deleteCookie("token");
                localStorage.removeItem("username");
                localStorage.removeItem("userId");
                localStorage.removeItem("email");
                navigate("/");
                toast.success(deleteuser.data.message);
            } else {
                toast.error(deleteuser.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete account.');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box className="min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar for User Dashboard */}
            <Box className="w-full lg:w-1/3 bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                    <CardContent>
                        <Typography variant="h4" className="text-gray-800 dark:text-white mb-4 font-bold">User Dashboard</Typography>
                        <div className="space-y-4">
                            <Card className="bg-gray-50 dark:bg-gray-700">
                                <CardContent>
                                    <Typography className="text-gray-700 dark:text-slate-50 font-medium">Username:</Typography>
                                    <Typography className="text-xl text-gray-900 dark:text-white font-bold">{username}</Typography>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-50 dark:bg-gray-700">
                                <CardContent>
                                    <Typography className="text-gray-700 dark:text-slate-50 font-medium">Email Address:</Typography>
                                    <Typography className="text-lg text-gray-900 dark:text-white font-bold">{email}</Typography>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col mt-6 space-y-4">
                                <Button
                                    onClick={handleClickOpen}
                                    style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                                    className="hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out"
                                >
                                    Delete Account
                                </Button>
                                <Button
                                    onClick={onForgetPassword}
                                    style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
                                    className="hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out"
                                >
                                    Forget Password
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Box>

            {/* Main Content for Transaction History */}
            <Box className="w-full lg:w-2/3 p-4">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <Typography variant="h4" className="text-gray-800 dark:text-white mb-4 font-bold">Order History</Typography>
                    <List>
                        {transactionHistory.length > 0 ? (
                            transactionHistory.map((transaction) => (
                                <ListItem key={transaction._id} className="dark:bg-gray-800">
                                    <ListItemText
                                        primary={`Transaction ID: ${transaction._id}`}
                                        secondary={
                                            <>
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
                </div>
            </Box>

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
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} variant="contained" color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserDashboard;
