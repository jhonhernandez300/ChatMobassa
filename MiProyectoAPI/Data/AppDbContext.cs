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

            base.OnModelCreating(modelBuilder);
        }
    }
}
