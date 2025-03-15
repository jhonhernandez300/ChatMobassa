using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Models;

namespace MiProyectoAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Mensaje> Mensajes { get; set; }
    }
}
