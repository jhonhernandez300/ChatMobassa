using System.Text.Json.Serialization;

namespace MiProyectoAPI.Models
{
    public class Mensaje
    {
        public int Id { get; set; }        
        public string Contenido { get; set; } = string.Empty;
        public DateTime FechaYHora { get; set; }
        public required int UsuarioId { get; set; }
        public string? gifUrl { get; set; }
        public string? videoUrl { get; set; }

        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}
