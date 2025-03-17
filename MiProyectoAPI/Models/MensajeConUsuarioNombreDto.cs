namespace MiProyectoAPI.Models
{
    public class MensajeConUsuarioNombreDto
    {
        public int id { get; set; }
        public string contenido { get; set; }
        public DateTime fechaYHora { get; set; }
        public int usuarioId { get; set; }
        public string usuarioNombre { get; set; }
    }
}
