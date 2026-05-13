import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { getProfile } from "../services/userService";

export default function AuthProvider({ children }) {

 const [user, setUser] = useState(null);

 useEffect(() => {

  getProfile()
   .then(res => setUser(res.data))
   .catch(() => {});

 }, []);

 return (
  <AuthContext.Provider value={{ user, setUser }}>
   {children}
  </AuthContext.Provider>
 );

}