import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../Controlls/Cartcontrolls.js';
import authenticateUser from '../MIDDLEWARES/usermiddleware.js';

const CartRouter = express.Router();

// Add to cart
CartRouter.post('/add-cart', authenticateUser, addToCart);

// Remove product from cart
CartRouter.delete(`/remove-item/:cartId/:itemId`, removeFromCart);

// Get cart for the specified user
CartRouter.get('/:userId', authenticateUser, getCart);

// Update quantity of product in cart
CartRouter.put(`/update-quantity/:cartId/:itemId`,authenticateUser, updateCartQuantity);


export default CartRouter;
