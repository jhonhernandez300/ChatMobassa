using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Data;
using MiProyectoAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiProyectoAPI.Controllers
{
    [Route("api/mensajes")] 
    [ApiController]
    public class MensajesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MensajesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("ObtenerMensajesConUsuario")]
        public async Task<IActionResult> ObtenerMensajesConUsuario()
        {
            var mensajes = await _context.Mensajes
                .Include(m => m.Usuario)
                .Select(m => new MensajeConUsuarioDTO

                {
                    Id = m.Id,
                    Contenido = m.Contenido,
                    FechaYHora = m.FechaYHora,
                    UsuarioId = m.UsuarioId,
                    UsuarioNombre = m.Usuario!.Nombre,
                    ImagenRuta = m.Usuario!.ImagenRuta,
                    gifUrl = m.gifUrl, // Asumiendo que esta propiedad existe en el modelo Mensajes
                    videoUrl = m.videoUrl // Asumiendo que esta propiedad existe en el modelo Mensajes
                })
                .ToListAsync();

            return Ok(mensajes);
        }

        [HttpPost("GuardarMensaje")]
        public async Task<ActionResult<Mensaje>> GuardarMensaje([FromBody] Mensaje mensaje)
        {
            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {
                return BadRequest(new { error = "Datos inválidos." });
            }

            mensaje.FechaYHora = DateTime.UtcNow;
            _context.Mensajes.Add(mensaje);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje.Id,
                mensaje.Contenido,
                mensaje.FechaYHora,
                mensaje.UsuarioId,
                mensaje.gifUrl,
                mensaje.videoUrl
            });
        }

    }
}
