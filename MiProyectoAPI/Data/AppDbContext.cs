using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Models;

namespace MiProyectoAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Mensaje> Mensajes { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>()
                .HasKey(df => df.UsuarioId);

            modelBuilder.Entity<Usuario>()
            .Property(u => u.UsuarioId)
            .ValueGeneratedOnAdd();

            //Seeds
            modelBuilder.Entity<Usuario>().HasData(
                 new Usuario
                 {
                     UsuarioId = 1,
                     Nombre = "James",
                     Correo = "james@gmail.com",
                     Password = "James0101*",
                     Apodo = "James",
                     ImagenURL ="James1"                     
                 },
                 new Usuario
                 {
                     UsuarioId = 2,
                     Nombre = "Radamel",
                     Correo = "radamel@gmail.com",
                     Password = "Radamel0101*",
                     Apodo = "Radamel",
                     ImagenURL = "Radamel1"
                 }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
