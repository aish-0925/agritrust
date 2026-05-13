import { markAsRead, markAllAsRead } from "../services/notificationService";
import { motion } from "framer-motion";

export default function NotificationDropdown({notifications,setNotifications}){

 const readOne = async(id)=>{

  await markAsRead(id);

  setNotifications(prev =>
   prev.map(n =>
    n._id === id ? {...n,isRead:true} : n
   )
  );

 };

 const readAll = async()=>{

  await markAllAsRead();

  setNotifications(prev =>
   prev.map(n => ({...n,isRead:true}))
  );

 };

 return(

  <motion.div
   initial={{opacity:0,y:-10}}
   animate={{opacity:1,y:0}}
   className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50"
  >

   <div className="flex justify-between items-center p-3 border-b">

    <p className="font-semibold">
     Notifications
    </p>

    <button
     onClick={readAll}
     className="text-sm text-green-600"
    >
     Mark all
    </button>

   </div>

   <div className="max-h-72 overflow-y-auto">

    {notifications.map(n => (

     <div
      key={n._id}
      onClick={()=>readOne(n._id)}
      className={`p-3 border-b cursor-pointer hover:bg-gray-100
       ${!n.isRead ? "bg-green-50" : ""}
      `}
     >

      <p className="text-sm">{n.message}</p>

      <p className="text-xs text-gray-500">
       {new Date(n.createdAt).toLocaleString()}
      </p>

     </div>

    ))}

   </div>

  </motion.div>

 );

}