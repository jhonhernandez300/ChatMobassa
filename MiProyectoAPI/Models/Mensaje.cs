using System.Text.Json.Serialization;

namespace MiProyectoAPI.Models
{
    public class Mensaje
    {
        public int Id { get; set; }        
        public string Contenido { get; set; }
        public DateTime FechaYHora { get; set; }
        public required int UsuarioId { get; set; }

        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}
