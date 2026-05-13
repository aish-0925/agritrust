import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell(){

 const [notifications,setNotifications] = useState([]);
 const [open,setOpen] = useState(false);

 useEffect(()=>{

  getNotifications()
  .then(res => setNotifications(res.data));

 },[]);

 const unreadCount = notifications.filter(n => !n.isRead).length;

 return(

  <div className="relative">

   <button
    onClick={()=>setOpen(!open)}
    className="relative text-xl"
   >
    🔔

    {unreadCount > 0 && (
     <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
      {unreadCount}
     </span>
    )}

   </button>

   {open && (
    <NotificationDropdown
     notifications={notifications}
     setNotifications={setNotifications}
    />
   )}

  </div>

 );

}