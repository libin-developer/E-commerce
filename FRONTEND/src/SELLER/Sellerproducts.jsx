import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openDialog, setOpenDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sellerId = localStorage.getItem('sellerId');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/seller-product/${sellerId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error('Failed to fetch products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/sellerhome/edit-product/${productId}`);
  };

  const handleOpenDialog = (productId) => {
    setProductToRemove(productId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setProductToRemove(null);
    setOpenDialog(false);
  };

  const handleConfirmRemove = async () => {
    if (!productToRemove) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/remove-product/${productToRemove}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== productToRemove));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing product:', error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-grow p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">My Products</h2>

        {loading ? (
          // Loading indicator
          <div className="flex justify-center items-center h-full">
            <CircularProgress color="inherit" />
          </div>
        ) : products.length === 0 ? (
          // No products message
          <div className="flex justify-center items-center h-full">
            <p className="text-xl dark:text-white">No Products Available</p>
          </div>
        ) : (
          // Product grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                <img src={product.image} alt={product.productname} className="w-full h-48 object-cover mb-4 rounded-lg" />
                <h3 className="text-lg font-bold dark:text-white">{product.productname}</h3>
                <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                <p className="text-gray-600 dark:text-gray-400">Category: {product.catogery}</p>
                <p className="text-gray-600 dark:text-gray-400">Stock: {product.stock}</p>
                <p className="text-green-500 font-bold">₹ {product.price}</p>
                <div className="flex justify-between mt-4 space-x-2">
                  <Button
                    onClick={() => handleEdit(product._id)}
                    style={{ backgroundColor: '#007bff', color: 'white' }} 
                    variant="contained"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleOpenDialog(product._id)}
                    style={{ backgroundColor: '#dc3545', color: 'white' }} 
                    variant="contained"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>Are you sure you want to remove this product?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="secondary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SellerProducts;
