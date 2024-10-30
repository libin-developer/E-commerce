import mongoose from "mongoose" ;
import Cart from '../DBmodels/cartmodel.js';
import Product from '../DBmodels/productsmodel.js';

// Add product to cart
export const addToCart = async (req, res) => {
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

    const existingItem = cart.items.find(item => item.productId.equals(product._id)); // Use product._id

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

    // product.stock -= quantity; // Decrease the product stock
    // await product.save();

    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove a product from the cart
export const removeFromCart = async (req, res) => {
  const { cartId, itemId } = req.params; // cartId and itemId passed from the URL

  try {
    // Find the cart by cartId
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item by itemId in the cart
    const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the total amount by subtracting the removed item's price * quantity
    cart.totalAmount -= cart.items[itemIndex].price * cart.items[itemIndex].quantity;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
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

// Update product quantity in cart
export const updateCartQuantity = async (req, res) => {
  const { cartId, itemId } = req.params; // cartId and itemId from URL
  const { quantity } = req.body; // Only quantity is sent in the request body

  try {
    // Validate if the cartId and itemId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid cart ID or item ID provided' });
    }

    // Find the cart by cartId
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart by itemId
    const item = cart.items.find(item => item._id.equals(itemId));
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Retrieve the productId from the item in the cart
    const productId = item.productId;
    
    // Find the product by productId to check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found in products database' });
    }

    // Check if the requested quantity exceeds available stock
    if (quantity > product.stock) {
      return res.status(400).json({ 
        message: "currently Out Of Stock", 
        availableStock: product.stock 
      });
    }

    // Update the cart quantity and totalAmount
    cart.totalAmount += (quantity - item.quantity) * product.price;
    item.quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Product quantity updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
