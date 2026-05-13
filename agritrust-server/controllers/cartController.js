const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* ================= ADD ================= */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Product not available"
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock"
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    const index = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.json({
        success: true,
        items: [],
        total: 0
      });
    }

    let total = 0;

    const items = cart.items.map(item => {
      const p = item.product;
      const subtotal = p.price * item.quantity;
      total += subtotal;

      return {
        id: p._id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || "",
        unit: p.unit,
        quantity: item.quantity,
        subtotal
      };
    });

    res.json({
      success: true,
      items,
      total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find(
      i => i.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({ success: true, cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ================= */
exports.removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    res.json({ success: true, cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CLEAR ================= */
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};