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
      const res = await axios.post("https://arafin3-001-site1.itempurl.com/api/Auth/login", formData);
      
      console.log("Login Full Response Data:", res.data); // ব্রাউজার কনসোলে ব্যাকএন্ড ডেটা দেখার জন্য

      // ১. টোকেন এবং রোল সেভ করা
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // 🎯 ২. ব্যাকএন্ড রেসপন্স থেকে আইডি এবং নাম খোঁজার সুপার-সেফ মেকানিজম (মেইন ফিক্স)
      const userId = res.data.id || res.data.Id || res.data.userId || res.data.patientId || res.data.user?.id || res.data.user?.Id || null;
      const userName = res.data.name || res.data.Name || res.data.user?.name || res.data.user?.Name || "Patient";

      // অবজেক্ট তৈরি
      const userObj = {
        id: userId,
        name: userName
      };

      // 🎯 ৩. লোকালস্টোরেজে "user" কি (Key) দিয়ে অবজেক্টটি সেভ করা
      localStorage.setItem("user", JSON.stringify(userObj));

      setMessage(`Welcome back, ${userName}! Login Successful.`);
      
      // ৪. রোল (Role) অনুযায়ী সঠিক ড্যাশবোর্ডে রিডাইরেক্ট করা
      setTimeout(() => {
        const userRole = res.data.role;
        if (userRole === "Admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "Doctor") {
          router.push("/dashboard/doctor");
        } else {
          router.push("/dashboard/patient");
        }
      }, 1000);

    } catch (err) {
      console.error("Login Error:", err);
      setMessage(err.response?.data || "Invalid email or password!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Medical Portal - Login</h2>
        {message && <p className="mb-4 text-center text-sm font-semibold text-green-500 bg-green-50 p-2 rounded">{message}</p>}
        
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          required 
          className="w-full p-3 mb-6 border rounded"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />

        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition">
          Login
        </button>
        <p className="mt-4 text-center text-sm">Don&apos;t have an account? <a href="/register" className="text-green-500 hover:underline">Register</a></p>
      </form>
    </div>
  );
}