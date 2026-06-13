"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Login() {
    const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5227/api/Auth/login", formData);
      
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      setMessage(`Welcome back, ${res.data.name}! Login Successful.`);
      
      
      router.push("/dashboard");
    } catch (err) {
      setMessage(err.response?.data || "Invalid email or password!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Patient Portal - Login</h2>
        {message && <p className="mb-4 text-center text-sm font-semibold text-green-500">{message}</p>}
        
        <input type="email" placeholder="Email Address" required className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        
        <input type="password" placeholder="Password" required className="w-full p-3 mb-6 border rounded"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm">Don&apos;t have an account? <a href="/register" className="text-green-500">Register</a></p>
        
      </form>
    </div>
  );
}