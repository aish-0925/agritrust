const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

title:{
type:String,
required:true
},

message:{
type:String,
required:true
},

type:{
type:String,
enum:["system","order","payment","delivery","advisory","welcome"],
default:"system"
},

/* Optional reference */

referenceId:{
type:mongoose.Schema.Types.ObjectId
},

referenceModel:{
type:String,
enum:["Order","Payment","Delivery","Advisory"]
},

isRead:{
type:Boolean,
default:false
}

},{
timestamps:true
});

module.exports = mongoose.model("Notification",notificationSchema);