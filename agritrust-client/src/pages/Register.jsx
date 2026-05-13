import { useState } from "react";
import axios from "axios";

export default function Register(){

const [form,setForm] = useState({
name:"",
email:"",
password:"",
role:"farmer",

});

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      form
    );

    //store auth data
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    //role-based redirect
    if (res.data.user.role === "restaurant") {
      window.location = "/restaurant/dashboard";
    } else {
      window.location = "/dashboard";
    }

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Registration failed");
  }
};

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-yellow-100">

<div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-96">

<h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
Register
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="text"
name="name"
placeholder="Full Name"
className="w-full border rounded-lg p-3 focus:outline-green-600"
onChange={handleChange}
/>

<input
type="email"
name="email"
placeholder="Email"
className="w-full border rounded-lg p-3 focus:outline-green-600"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
className="w-full border rounded-lg p-3 focus:outline-green-600"
onChange={handleChange}
/>

<select
name="role"
className="w-full border rounded-lg p-3"
onChange={handleChange}
>

<option value="farmer">Farmer</option>
<option value="restaurant">Restaurant</option>

</select>

<button
className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
>
Register
</button>

</form>

<p className="text-sm text-center mt-5">
Already have an account?
<a href="/login" className="text-green-700 font-semibold ml-1">
Login
</a>
</p>

</div>

</div>

);

}