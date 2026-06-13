using Microsoft.EntityFrameworkCore;
using PatientPortal.API.Models;

namespace PatientPortal.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
    }
}