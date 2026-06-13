using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatientPortal.API.Data;
using PatientPortal.API.Models;

namespace PatientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ১. অ্যাপয়েন্টমেন্ট বুক করার এপিআই (Patient করবে)
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment booked successfully!" });
        }

        // ২. সব অ্যাপয়েন্টমেন্ট দেখার এপিআই (Doctor/Admin এর জন্য)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _context.Appointments.OrderByDescending(a => a.AppointmentDate).ToListAsync();
            return Ok(appointments);
        }

        // ৩. কোনো নির্দিষ্ট পেশেন্টের অ্যাপয়েন্টমেন্ট দেখার এপিআই
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPatientAppointments(int patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
            return Ok(appointments);
        }
        // ৪. অ্যাপয়েন্টমেন্টের স্ট্যাটাস আপডেট করার এপিআই (Admin করবে)
        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var appointment = await _context.Appointments.FindAsync(id);
               if (appointment == null)
        {
            return NotFound("Appointment not found.");
        }

             appointment.Status = status; // Pending -> Approved or Cancelled
               await _context.SaveChangesAsync();

               return Ok(new { message = $"Appointment status updated to {status}!" });
        }
    }
}