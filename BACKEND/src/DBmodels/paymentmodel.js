// backend/DBmodels/paymentmodel.js

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  amount: Number,
  productId: [String],
  userId: String,
  status: {
    type: String,
    enum: ['pending', 'captured', 'failed'],
    default: 'pending',
  },
  date:{
    type:Date,
    default:Date.now
}
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
