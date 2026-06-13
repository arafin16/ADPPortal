"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  // সব অ্যাপয়েন্টমেন্ট ডাটাবেজ থেকে নিয়ে আসা
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5227/api/Appointment/all");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments.");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
      router.push("/login");
      return;
    }

    const loadAppointments = async () => {
      await fetchAppointments();
    };

    loadAppointments();
  }, [router]);

  // স্ট্যাটাস পরিবর্তন করা (Approve/Cancel)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5227/api/Appointment/status/${id}`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" }
      });
      setMessage(res.data.message);
      fetchAppointments(); // টেবিল রিফ্রেশ করা
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-4">
            <a href="#" className="block py-2.5 px-4 rounded bg-purple-950 font-semibold">Manage Bookings</a>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2.5 rounded font-bold transition">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard ⚙️</h1>
          <p className="text-gray-600">Overview of all patient appointments and system controls.</p>
        </header>

        {message && <p className="mb-4 text-sm font-semibold text-purple-700 bg-purple-50 p-2 rounded max-w-md">{message}</p>}

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-100 text-purple-900 uppercase text-sm font-bold">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Doctor Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No appointments booked yet.</td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{app.patientName}</td>
                    <td className="p-4">{app.doctorName}</td>
                    <td className="p-4">{new Date(app.appointmentDate).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        app.status === "Approved" ? "bg-green-100 text-green-700" :
                        app.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>{app.status}</span>
                    </td>
                    <td className="p-4 space-x-2">
                      {app.status === "Pending" && (
                        <>
                          <button onClick={() => handleStatusUpdate(app.id, "Approved")}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition">
                            Approve
                          </button>
                          <button onClick={() => handleStatusUpdate(app.id, "Cancelled")}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition">
                            Cancel
                          </button>
                        </>
                      )}
                      {app.status !== "Pending" && <span className="text-gray-400 text-xs">No Action Needed</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}