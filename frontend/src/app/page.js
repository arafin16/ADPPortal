"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col justify-between">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-blue-600 font-bold">🩺 Patient Portal</span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between flex-1 gap-12">
        
        {/* Left Side: Text and Buttons */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Your Health, Our Priority. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Smart Healthcare Solution
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Welcome to Patient Portal. Book appointments with top doctors, manage your prescriptions, and track your medical logs—all in one place. Secure, fast, and easy to use.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-center px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition">
              Get Started (রোগী/ডাক্তার)
            </Link>
            <Link href="/login" className="bg-white hover:bg-gray-50 text-gray-800 text-center px-8 py-3.5 rounded-xl font-bold border border-gray-300 shadow-sm transition">
              Sign In to Dashboard
            </Link>
          </div>
        </div>

        {/* Right Side: Features Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Patients can view real-time doctor availability and book instantly.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            <div className="text-3xl mb-3">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Doctor Panel</h3>
            <p className="text-gray-600 text-sm">Doctors can manage their appointment streams and student schedules.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Control</h3>
            <p className="text-gray-600 text-sm">Full administrative power to approve, cancel, and oversee bookings.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure JWT</h3>
            <p className="text-gray-600 text-sm">Your medical data and identity are protected with secure encryption.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Patient Portal. All rights reserved.</p>
      </footer>

    </div>
  );
}