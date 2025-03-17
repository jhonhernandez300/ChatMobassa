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

        [HttpGet("ObtenerMensajes")]
        public async Task<ActionResult<IEnumerable<Mensaje>>> ObtenerMensajes()
        {
            return await _context.Mensajes.ToListAsync();
        }

        [HttpPost("GuardarMensaje")]
        public async Task<ActionResult<Mensaje>> GuardarMensaje([FromBody] Mensaje mensaje)
        {
            Console.WriteLine($"[API] Recibido: UsuarioId={mensaje?.UsuarioId}, Contenido={mensaje?.Contenido}, FechaYHora={mensaje?.FechaYHora}");

            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {
                Console.WriteLine("[API] ❌ Error: Datos inválidos");
                return BadRequest(new { error = "Datos inválidos." });
            }

            mensaje.FechaYHora = DateTime.UtcNow;
            _context.Mensajes.Add(mensaje);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerMensajes), new { id = mensaje.Id }, mensaje);
        }

    }
}
