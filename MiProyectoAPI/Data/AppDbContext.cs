using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Models;
using System.Threading;

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

            //Relaciones
            modelBuilder.Entity<Mensaje>()
                .HasOne(df => df.Usuario)
                .WithMany(f => f.Mensajes)
                .HasForeignKey(df => df.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            //Seeds
            modelBuilder.Entity<Usuario>().HasData(
                 new Usuario
                 {
                     UsuarioId = 1,
                     Nombre = "James",
                     Correo = "james@gmail.com",
                     Password = "James0101*",
                     Apodo = "James",
                     ImagenRuta = "James1"                     
                 },
                 new Usuario
                 {
                     UsuarioId = 2,
                     Nombre = "Radamel",
                     Correo = "radamel@gmail.com",
                     Password = "Radamel0101*",
                     Apodo = "Radamel",
                     ImagenRuta = "Radamel1"
                 }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
