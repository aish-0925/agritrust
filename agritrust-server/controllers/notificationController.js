const Notification = require("../models/Notification");


/* Get all notifications */

exports.getNotifications = async (req,res) => {

try{

const notifications = await Notification
.find({user:req.user.id})
.sort({createdAt:-1});

res.json(notifications);

}
catch(error){
res.status(500).json({error:error.message});
}

};



/* Mark notification as read */

exports.markAsRead = async (req,res)=>{

try{

await Notification.findByIdAndUpdate(
req.params.id,
{isRead:true}
);

res.json({message:"Notification marked as read"});

}
catch(error){
res.status(500).json({error:error.message});
}

};



/* Mark all as read */

exports.markAllAsRead = async (req,res)=>{

try{

await Notification.updateMany(
{user:req.user.id},
{isRead:true}
);

res.json({message:"All notifications marked as read"});

}
catch(error){
res.status(500).json({error:error.message});
}

};