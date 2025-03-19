namespace MiProyectoAPI.Models
{
    public class MensajeConUsuarioDTO
    {
        public int Id { get; set; }
        public string Contenido { get; set; }
        public DateTime FechaYHora { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; }
        public string? ImagenRuta { get; set; } // Imagen opcional
    }
}
