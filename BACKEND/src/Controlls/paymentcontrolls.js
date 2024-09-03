
import Razorpay from 'razorpay';
import Payment from '../DBmodels/paymentmodel.js';
import Product from "../DBmodels/productsmodel.js"
import serverconfig from '../Config/serverconfig.js';


const razorpay = new Razorpay({
  key_id: serverconfig.Razorpaykeyid, // Your Razorpay key ID
  key_secret: serverconfig.Razorpaysecret, // Your Razorpay secret
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Math.random().toString(36).substring(2, 15)}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, amount, productId, userId, paymentStatus } = req.body;

    // Save the payment details in the database
    const payment = await Payment.create({
      paymentId,
      orderId,
      amount,
      productId,
      userId,
      status: paymentStatus || 'pending', // Default to 'pending' if status is not provided
    });

    // Update product stock
    if (paymentStatus === 'success') { // Only update stock if the payment is successful
      const product = await Product.findById(productId);

      if (product) {
        // Check if there is enough stock
        if (product.stock > 0) {
          product.stock -= 1; // Decrease stock by 1 or by the quantity purchased
          await product.save();
        } else {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // Respond with success
    res.status(200).json({ message: 'Payment details saved successfully and stock updated', payment });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ message: 'Failed to save payment details' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Payment.find({ userId });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
