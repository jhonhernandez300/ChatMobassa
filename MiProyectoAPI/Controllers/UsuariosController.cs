using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("ObtenerNombre/{usuarioId}")]
        public async Task<IActionResult> ObtenerNombre(int usuarioId)
        {
            try
            {
                if (usuarioId <= 0) // Validamos si es un ID inválido
                {
                    return BadRequest("El ID de usuario no es válido.");
                }

                var usuario = await _context.Usuarios
                    .Where(u => u.UsuarioId == usuarioId)
                    .Select(u => u.Nombre)
                    .FirstOrDefaultAsync();

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el nombre del usuario: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UsuarioCorto usuarioCorto)
        {
            if (usuarioCorto == null)
            {
                return BadRequest("Los datos de acceso son nulos.");
            }

            var usuarioEncontrado = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == usuarioCorto.Correo && u.Password == usuarioCorto.Password);

            if (usuarioEncontrado == null)
            {
                return Unauthorized("Correo o contraseña incorrectos.");
            }

            return Ok(new { message = "Login exitoso", usuarioId = usuarioEncontrado.UsuarioId, usuarioEncontrado.Nombre });
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
