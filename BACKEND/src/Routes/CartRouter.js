import express from 'express';
import {addToCart,clearCart,getCart} from "../Controlls/Cartcontrolls.js"
import authenticateUser from '../MIDDLEWARES/usermiddleware.js';
const CartRouter = express.Router();

CartRouter.post('/add-cart',authenticateUser,addToCart);
CartRouter.delete('/clear/:cartId',authenticateUser,clearCart);
CartRouter.get('/:userId',getCart);

export default CartRouter;
