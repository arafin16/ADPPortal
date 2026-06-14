"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDashboard() {
  const router = useRouter();
  const [name] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("name") || "Doctor";
    }
    return "Doctor";
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorAppointments = async (doctorName) => {
    if (!doctorName) return;
    try {
      const res = await axios.get("https://arafin3-001-site1.itempurl.com/api/Appointment/all");
      const myAppointments = res.data.filter(
        (app) => app.doctorName.toLowerCase() === `dr. ${doctorName.toLowerCase()}` || 
                 app.doctorName.toLowerCase() === doctorName.toLowerCase()
      );
      setAppointments(myAppointments);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch doctor appointments.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const role = localStorage.getItem("role");
    const doctorName = localStorage.getItem("name");

    if (role !== "Doctor") {
      router.push("/login");
      return;
    }

    const loadAppointments = async () => {
      await fetchDoctorAppointments(doctorName);
    };

    loadAppointments();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-teal-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Doctor Panel</h2>
          <nav className="space-y-4">
            <a href="#" className="block py-2.5 px-4 rounded bg-teal-900 font-semibold">My Appointments</a>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2.5 rounded font-bold transition">
          Logout
        </button>
      </div>

      <div className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Dr. {name}! 🩺</h1>
          <p className="text-gray-600">Below is the list of patients who booked an appointment with you.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 font-medium uppercase text-sm">Total Patients</h3>
            <p className="text-2xl font-bold text-teal-600 mt-2">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 font-medium uppercase text-sm">Pending Appointments</h3>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {appointments.filter(a => a.status === "Pending").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="bg-teal-700 text-white p-4 font-bold text-lg">Patient Serials</h2>
          
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading appointments...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-teal-50 text-teal-900 uppercase text-sm font-bold border-b">
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Appointment Date & Time</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">No patients have booked an appointment with you yet.</td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{app.patientName}</td>
                      <td className="p-4">{new Date(app.appointmentDate).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          app.status === "Approved" ? "bg-green-100 text-green-700" :
                          app.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>{app.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}