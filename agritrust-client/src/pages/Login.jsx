import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Login() {

const navigate = useNavigate();
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");


const handleSubmit = async (e)=>{
e.preventDefault();

try{

const res = await axios.post(
"http://localhost:5000/api/auth/login",
{ email,password }
);

localStorage.setItem("token",res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
/* redirect after login */
if (res.data.user.role === "restaurant") {
  navigate("/restaurant/dashboard");
} else {
  navigate("/dashboard");
}

alert("Login Successful");

}catch(err){
  console.error(err.response?.data || err.message);
  alert(err.response?.data?.message || "Login failed");
}

};

return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-yellow-100">

<div className="grid md:grid-cols-2 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full">

{/* Left Section */}

<div className="hidden md:flex flex-col justify-center items-center bg-green-600 text-white p-10">

<h1 className="text-3xl font-bold mb-3">
Welcome to AgriTrust
</h1>

<p className="text-center opacity-90">
Connecting Farmers and Restaurants Directly
</p>

</div>

{/* Right Section */}

<div className="p-10">

<h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
Login
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="email"
placeholder="Enter your email"
className="w-full border rounded-lg p-3 focus:outline-green-600"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Enter your password"
className="w-full border rounded-lg p-3 focus:outline-green-600"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
>
Login
</button>

</form>

<p className="text-sm text-center mt-5">
New here? 
<a href="/register" className="text-green-700 font-semibold ml-1">
Register Now
</a>
</p>

</div>

</div>

</div>

);

}