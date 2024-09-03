import mongoose from 'mongoose';
import Cart from "../DBmodels/cartmodel.js";
import Product from "../DBmodels/productsmodel.js";

// Add product to cart
  export  const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient product stock' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(item => item.productId.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.productname,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    cart.totalAmount += product.price * quantity;
    await cart.save();

    product.stock -= quantity;
    await product.save();

    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove product from cart

export const clearCart = async (req, res) => {
  const { cartId } = req.params;

  try {
      // Find the cart by _id and clear its items
      const result = await Cart.findByIdAndUpdate(
          cartId,
          { $set: { items: [], totalAmount: 0 } },
          { new: true }
      );

      if (!result) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      res.json({ message: 'Cart cleared successfully', cart: result });
  } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};
// Get cart details
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


