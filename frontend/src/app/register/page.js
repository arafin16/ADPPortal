"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Patient" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.post("https://arafin3-001-site1.itempurl.com/api/Auth/register", formData);
      setMessage(res.data.message);
      setTimeout(() => router.push("/login"), 2000); // ২ সেকেন্ড পর লগইন 
    } catch (err) {
      setMessage(err.response?.data || "Registration failed!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Patient Portal - Register</h2>
        {message && <p className="mb-4 text-center text-sm font-semibold text-blue-500">{message}</p>}
        
        <input type="text" placeholder="Full Name" required className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        
        <input type="email" placeholder="Email Address" required className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        
        <input type="password" placeholder="Password" required className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        
        <select className="w-full p-3 mb-6 border rounded bg-white"
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="Patient">Patient </option>
          <option value="Doctor">Doctor </option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Register
        </button>
        <p className="mt-4 text-center text-sm">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </form>
    </div>
  );
}