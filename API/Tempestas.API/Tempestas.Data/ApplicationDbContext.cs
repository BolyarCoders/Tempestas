using Microsoft.EntityFrameworkCore;
using Tempestas.Data.Models.Models;

namespace Tempestas.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Device> Devices { get; set; }
    }
}
