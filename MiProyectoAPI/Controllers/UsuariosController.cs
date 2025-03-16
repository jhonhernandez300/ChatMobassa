using Microsoft.AspNetCore.Mvc;
using MiProyectoAPI.Data;
using MiProyectoAPI.Models;

namespace MiProyectoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : Controller
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("GuardarUsuario")]
        public async Task<IActionResult> GuardarUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
            {
                return BadRequest("El usuario es nulo.");
            }

            try
            {
                // Forzar que UsuarioId sea 0 para que se autoincremente
                usuario.UsuarioId = 0;

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Usuario guardado con éxito", usuario });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar el usuario: {ex.Message}");
            }
        }

    }
}
