"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [message, setMessage] = useState("");
  
  // 🎯 লোকালস্টোরেজ থেকে আইডি রিড করার সুপার-সেফ এবং ক্র্যাশ-প্রুফ মেকানিজম
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") return { id: null, name: "Patient" };

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return { id: null, name: "Patient" };

      const parsedUser = JSON.parse(userData);
      
      // 🎯 ব্যাকএন্ডের ডটনেট কন্ট্রোলার যে বানানেই আইডি পাঠাক না কেন (ছোট/বড় হাত/অবজেক্ট)—সব ব্যাকআপ এখানে হ্যান্ডেল করা হলো
      const userId = parsedUser.id || parsedUser.Id || parsedUser.ID || parsedUser.userId || parsedUser.patientId || null;
      const userName = parsedUser.name || parsedUser.Name || parsedUser.userName || "Patient";

      return { id: userId, name: userName };
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return { id: null, name: "Patient" };
    }
  });

  // ১. পেজ লোড হলেই ডক্টর লিস্ট ফেচ করা
  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🎯 ইউজার আইডি পারফেক্টলি সেট হওয়ার পর কেবল অ্যাপয়েন্টমেন্ট লিস্ট লোড হবে
  useEffect(() => {
    if (currentUser.id) {
      fetchMyAppointments(currentUser.id);
    }
  }, [currentUser.id]);

  async function fetchDoctors() {
    try {
      const res = await axios.get("https://arafin3-001-site1.itempurl.com/api/Auth/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors.");
    }
  }

  async function fetchMyAppointments(patientId) {
    if (!patientId) return;
    try {
      const res = await axios.get(`https://arafin3-001-site1.itempurl.com/api/Appointment/patient/${patientId}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments.", err);
    }
  }

  // ২. ডাইনামিক অ্যাপয়েন্টমেন্ট বুকিং
  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate) {
      setMessage("Please select a doctor and date/time.");
      return;
    }

    // 🎯 রিয়েল-টাইমে সেফ চেক
    if (!currentUser.id) {
      setMessage("User not authenticated. Please logout and login again.");
      return;
    }

    try {
      const formattedDate = new Date(appointmentDate).toISOString();

      const res = await axios.post("https://arafin3-001-site1.itempurl.com/api/Appointment/book", {
        PatientId: Number(currentUser.id), 
        PatientName: currentUser.name, 
        DoctorName: selectedDoctor,
        AppointmentDate: formattedDate,
        Status: "Pending"
      });

      setMessage(res.data.message || "Booked successfully!");
      fetchMyAppointments(currentUser.id); // টেবিল অটো রিফ্রেশ
      setSelectedDoctor("");
      setAppointmentDate("");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      setMessage("Booking failed. Please try again.");
    }
  };

  // ৩. অ্যাপয়েন্টমেন্ট ক্যানсел করা
  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.put(`https://arafin3-001-site1.itempurl.com/api/Appointment/status/${id}`, 
        { status: "Cancelled" }, 
        { headers: { "Content-Type": "application/json" } }
      );
      fetchMyAppointments(currentUser.id); // ক্যানсел হওয়ার পর টেবিল রিফ্রেশ
    } catch (err) {
      alert("Failed to cancel appointment.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Patient Portal</h2>
          <button className="w-full bg-blue-900 text-left py-3 px-4 rounded font-semibold mb-2">
            Book Appointment
          </button>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }} 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {currentUser.name}!</h1>
        <p className="text-gray-600 mb-8">Manage your bookings and check appointment status in real-time.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Book New Appointment</h3>
            {message && (
              <p className={`mb-4 text-sm font-semibold p-2 rounded ${
                message.includes("successfully") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              }`}>
                {message}
              </p>
            )}
            
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                <select
                  className="w-full border rounded p-2 bg-white"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map((doc, idx) => (
                    <option key={idx} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded p-2"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Appointments List Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">My Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 font-bold text-sm">
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-6 text-gray-500">No appointments found.</td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app.id || app.Id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-medium text-gray-800">{app.doctorName || app.DoctorName}</td>
                        <td className="p-3 text-gray-600">
                          {app.appointmentDate || app.AppointmentDate ? new Date(app.appointmentDate || app.AppointmentDate).toLocaleString() : "N/A"}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            (app.status || app.Status) === "Approved" ? "bg-green-100 text-green-800" :
                            (app.status || app.Status) === "Cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {app.status || app.Status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {(app.status || app.Status) !== "Cancelled" ? (
                            <button
                              onClick={() => handleCancel(app.id || app.Id)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded font-semibold transition"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs italic">No Action</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}