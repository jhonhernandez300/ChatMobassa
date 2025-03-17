using System.ComponentModel.DataAnnotations;

namespace MiProyectoAPI.Models
{
    public class UsuarioCorto
    {
        public required string Correo { get; set; }
        public required string Password { get; set; }     
    }
}
