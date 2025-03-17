using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Threading;

namespace MiProyectoAPI.Models
{
    public class Usuario
    {
        [Key]        
        public int UsuarioId { get; set; }
        public required string Nombre { get; set; }
        public required string Correo { get; set; }
        public required string Password { get; set; }
        public required string Apodo { get; set; }
        public required string ImagenURL { get; set; }

        [JsonIgnore]
        public ICollection<Mensaje>? Mensajes { get; set; }
    }
}
