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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mensaje>>> GetMensajes()
        {
            return await _context.Mensajes.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Mensaje>> PostMensaje(Mensaje mensaje)
        {
            _context.Mensajes.Add(mensaje);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMensajes), new { id = mensaje.Id }, mensaje);
        }
    }
}
