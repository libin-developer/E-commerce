import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaStar, FaStore, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../uTILS/Removecookies';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [adminInfo] = useState({
    name: localStorage.getItem("username"),
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
  
  const [openDelete, setOpenDelete] = useState(false);  // State for delete dialog visibility
  const [openLogout, setOpenLogout] = useState(false); // State for logout dialog visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/total-status`,{
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
    const id = localStorage.getItem("userId");
    try {
      const res = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/delete-account/${id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        deleteCookie();
        localStorage.clear();
        toast.success(res.data.message);
        navigate('/signin');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/logout`, {}, {
        withCredentials: true,
      });
      if (response.data.success) {
        deleteCookie();
        localStorage.clear();
        toast.success('Successfully logged out');
        navigate('/signin');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const handleForgetPassword = () => {
    navigate("/signin/forgetpassword");
    deleteCookie();
    localStorage.clear();
  };

  // Dialog control handlers
  const handleOpenDeleteDialog = () => setOpenDelete(true);
  const handleCloseDeleteDialog = () => setOpenDelete(false);
  const handleConfirmDelete = () => {
    handleDeleteAccount();
    handleCloseDeleteDialog();
  };

  const handleOpenLogoutDialog = () => setOpenLogout(true);
  const handleCloseLogoutDialog = () => setOpenLogout(false);
  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseLogoutDialog();
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-full sm:w-1/4 p-6 bg-gray-800 shadow-md flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="space-y-4">
          {/* Admin Info Boxes */}
          {Object.entries(adminInfo).map(([key, value]) => (
            <div key={key} className="p-4 rounded-md bg-gray-700 shadow-md">
              <p className="text-lg font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </p>
              <p className="text-md">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleForgetPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Forget Password
          </button>
          <button
            onClick={handleOpenDeleteDialog}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Account
          </button>
          <button
            onClick={handleOpenLogoutDialog}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Boxes */}
        <div className="p-4 rounded-lg shadow-md bg-blue-500 flex items-center space-x-4">
          <FaBox className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-green-500 flex items-center space-x-4">
          <FaStar className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Reviews</h3>
            <p className="text-2xl font-bold">{stats.totalReviews}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-orange-500 flex items-center space-x-4">
          <FaShoppingCart className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-purple-500 flex items-center space-x-4">
          <FaStore className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Sellers</h3>
            <p className="text-2xl font-bold">{stats.totalSellers}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-red-500 flex items-center space-x-4">
          <FaUsers className="text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Account Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogout} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
