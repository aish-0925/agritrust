const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/* Dashboard basic info */

exports.getDashboard = async (req,res)=>{

 try{

  const user = await User
  .findById(req.user.id)
  .select("-password");

  if(!user){
   return res.status(404).json({
    message:"User not found"
   });
  }

  res.json({
   message:"Dashboard loaded",
   user
  });

 }
 catch(error){
  res.status(500).json({error:error.message});
 }

};


/* Farmer stats for dashboard cards */

exports.getFarmerStats = async (req,res)=>{

 try{

  const farmerId = req.user.id;

  const totalProducts = await Product.countDocuments({
   farmer: farmerId
  });

  const availableProducts = await Product.countDocuments({
   farmer: farmerId,
   isAvailable: true
  });

  const lowStockProducts = await Product.countDocuments({
   farmer: farmerId,
   availableQuantity: { $lt: 10 }
  });

  res.json({
   totalProducts,
   availableProducts,
   lowStockProducts
  });

 }
 catch(error){
  res.status(500).json({error:error.message});
 }

};


exports.getRestaurantStats = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("items.product");

    const totalOrders = orders.length;

    const totalSpend = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const suppliers = new Set();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product?.farmer) {
          suppliers.add(item.product.farmer.toString());
        }
      });
    });

    res.json({
      activeSuppliers: suppliers.size,
      ordersThisMonth: totalOrders,
      totalSpend,
      freshnessScore: 9.2
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};