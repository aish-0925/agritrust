const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const axios = require("axios");

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

exports.getFarmerWeather = async (req, res) => {

  try {

    const farmer = await User.findById(req.user.id);

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found"
      });
    }

    console.log("FARMER:", farmer);
    console.log("LOCATION:", farmer.location);

    if (
      !farmer.location ||
      !farmer.location.lat ||
      !farmer.location.lng
    ) {
      return res.status(400).json({
        message: "Location not available"
      });
    }

    const { lat, lng } = farmer.location;

    const weatherRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon: lng,
          appid: process.env.WEATHER_API_KEY,
          units: "metric"
        }
      }
    );

    const data = weatherRes.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      rain:
        data.rain?.["1h"] ||
        data.rain?.["3h"] ||
        0
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch weather"
    });

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