import Razorpay from 'razorpay';
import Payment from '../DBmodels/paymentmodel.js';
import Product from "../DBmodels/productsmodel.js";
import serverconfig from '../Config/serverconfig.js';
import Cart from '../DBmodels/cartmodel.js';

const razorpay = new Razorpay({
  key_id: serverconfig.Razorpaykeyid, // Your Razorpay key ID
  key_secret: serverconfig.Razorpaysecret, // Your Razorpay secret
});

// Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Math.random().toString(36).substring(2, 15)}`, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Capture the payment and update stock
export const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, amount, userId, paymentStatus } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Save the payment details (without products initially)
    const payment = await Payment.create({
      paymentId,
      orderId,
      amount,
      userId,
      status: paymentStatus || 'pending', // Default to 'pending' if not provided
    });

    // Only update stock if payment is successful
    if (paymentStatus === 'captured') {
      for (const item of cart.items) {
        const product = await Product.findById(item.productId._id);

        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.productName}` });
        }

        // Check if there's enough stock
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity; // Deduct the purchased quantity from stock
          await product.save();
        } else {
          return res.status(400).json({ message: `Insufficient stock for ${item.productName}` });
        }

        // Add product details to the payment record
        payment.products.push({
          productId: item.productId._id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        });
      }

      // Save updated payment with products
      await payment.save();

      // Clear only the items and totalAmount in the user's cart, keep cartId and userId
      await Cart.findByIdAndUpdate(cart._id, {
        $set: {
          items: [],
          totalAmount: 0,
        },
      });

      res.status(200).json({ message: 'Payment successful, stock updated, and cart cleared', payment });
    } else {
      res.status(400).json({ message: 'Payment failed, stock not updated' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Failed to capture payment' });
  }
};


// Get transactions for a specific user
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
