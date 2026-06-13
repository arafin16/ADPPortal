"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const router = useRouter();
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("name") || "Patient";
    }
    return "Patient";
  });
  const [doctors, setDoctors] = useState([]); // ডাটাবেজের ডাক্তারদের লিস্ট রাখার জন্য
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Patient") {
      router.push("/login");
      return;
    }

    const getDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5227/api/Auth/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors list.");
      }
    };

    getDoctors(); // পেজ লোড হলেই ডাক্তারদের লিস্ট নিয়ে আসবে
  }, [router]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        patientId: 1, 
        patientName: name,
        doctorName: doctorName,
        appointmentDate: new Date(appointmentDate).toISOString(),
        status: "Pending"
      };

      const res = await axios.post("http://localhost:5227/api/Appointment/book", appointmentData);
      setMessage(res.data.message);
      setDoctorName("");
      setAppointmentDate("");
    } catch (err) {
      setMessage("Failed to book appointment.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Patient Portal</h2>
          <nav className="space-y-4">
            <a href="#" className="block py-2.5 px-4 rounded bg-blue-900 font-semibold">Book Appointment</a>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2.5 rounded font-bold transition">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {name}! 👋</h1>
          <p className="text-gray-600">Fill the form below to book a doctor&apos;s serial.</p>
        </header>

        {/* Appointment Form */}
        <div className="max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Book New Appointment</h2>
          {message && <p className="mb-4 text-sm font-semibold text-green-600 bg-green-50 p-2 rounded text-center">{message}</p>}
          
          <form onSubmit={handleBookAppointment}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Doctor</label>
              <select required className="w-full p-3 border rounded bg-white text-gray-700" value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}>
                <option value="">-- Choose a Doctor --</option>
                {/* এখানে ডাটাবেজ থেকে আসা ডাক্তারদের লুপ ঘুরিয়ে দেখানো হচ্ছে */}
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Appointment Date & Time</label>
              <input type="datetime-local" required className="w-full p-3 border rounded text-gray-700" value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)} />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded transition">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}