// paymentRoutes.js
import express from 'express';
import { capturePayment, createOrder, getTransactions } from '../Controlls/paymentcontrolls.js';
import authenticateUser from '../MIDDLEWARES/usermiddleware.js';




const paymentRouter = express.Router();

paymentRouter.post('/create-order',authenticateUser,createOrder);

paymentRouter.post('/capture-payment',authenticateUser,capturePayment);

paymentRouter.get('/transactions/:userId',authenticateUser,getTransactions);





export default paymentRouter;
