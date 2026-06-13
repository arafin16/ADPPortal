using System;

namespace PatientPortal.API.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}