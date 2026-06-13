"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardBridge() {
  const router = useRouter();

  useEffect(() => {
  const role = localStorage.getItem("role");

  if (!role) {
    router.push("/login");
  } else if (role === "Admin") {
    router.push("/dashboard/admin"); 
  } else if (role === "Doctor") {
    router.push("/dashboard/doctor");
  } else {
    router.push("/dashboard/patient");
  }
}, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-xl font-semibold text-gray-600 animate-pulse">Loading your dashboard...</p>
    </div>
  );
}