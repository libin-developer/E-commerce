import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaStar, FaStore, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../uTILS/Removecookies';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [adminInfo] = useState({
    name: localStorage.getItem("adminname"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    totalOrders: 0,
    totalSellers: 0,
    totalUsers: 0,
  });
  
  const [open, setOpen] = useState(false);  // State to handle dialog visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/product/total-status',{
          withCredentials:true
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleDeleteAccount = async () => {
    const id =localStorage.getItem("adminId")
    try {
     const res =await axios.delete(`http://localhost:3000/api/v1/admin/delete-admin/${id}`,{
        withCredentials:true
      });
      if(res.data.success){
      deleteCookie();
      localStorage.clear();
      toast.success(res.data.message)
      navigate('/admin');
      }else{
        toast.error(res.data.message)
      }
     
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleForgetPassword = () => {
    navigate("/admin/forgetpassword");
    deleteCookie();
    localStorage.clear();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    handleClose();
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-full sm:w-1/4 p-6 bg-gray-800 shadow-md flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Name: {adminInfo.name}</p>
          <p className="text-md">Email: {adminInfo.email}</p>
          <p className="text-md">Role: {adminInfo.role}</p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleForgetPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Forget Password
          </button>
          <button
            onClick={handleClickOpen}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg shadow-md bg-blue-500 flex items-center space-x-4">
          <FaBox className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold text-smoky-white">Total Products</h3>
            <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md bg-green-500 flex items-center space-x-4">
          <FaStar className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold text-smoky-white">Total Reviews</h3>
            <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md bg-orange-500 flex items-center space-x-4">
          <FaShoppingCart className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold text-smoky-white">Total Orders</h3>
            <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md bg-purple-500 flex items-center space-x-4">
          <FaStore className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold text-smoky-white">Total Sellers</h3>
            <p className="text-2xl font-bold text-white">{stats.totalSellers}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md bg-red-500 flex items-center space-x-4">
          <FaUsers className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold text-smoky-white">Total Users</h3>
            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
