const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

exports.register = async(req,res)=>{

try{

const {name,email,password,role} = req.body;

let user = await User.findOne({email});

if(user){
return res.status(400).json({message:"User already exists"});
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

user = new User({
name,
email,
password:hashedPassword,
role
});

await user.save();

await Notification.create({
  user: user._id,
  title: "Welcome to AgriTrust",
  message:
    user.role === "farmer"
      ? `Welcome ${user.name}! 🌱 Start listing your farm products and reach buyers.`
      : `Welcome ${user.name}! 🍽 Explore fresh produce and place your first order.`,
  type: "welcome",
  isRead: false
});

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    role: user.role,
    profileCompleted: user.profileCompleted
  }
});

}
catch (error) {
  console.error("REGISTER ERROR:", error);  
  res.status(500).json({ message: error.message });
}

};

//login
exports.login = async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"Invalid email"});
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.status(400).json({message:"Invalid password"});
}

const token = jwt.sign(
{ id:user._id, role:user.role },
process.env.JWT_SECRET,
{ expiresIn:"1d" }
);

res.json({
token,
user:{
id:user._id,
name:user.name,
role:user.role
}
});

}
catch(error){
res.status(500).json({error:error.message});
}

};