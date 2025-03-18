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

                if (string.IsNullOrEmpty(usuario)) // Verificar si la respuesta es null o vacía
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
        public async Task<IActionResult> GuardarUsuario([FromForm] Usuario usuario, IFormFile? imagen)
        {
            if (usuario == null)
            {
                return BadRequest("El usuario es nulo.");
            }

            try
            {
                // Forzar que UsuarioId sea 0 para que se autoincremente
                usuario.UsuarioId = 0;

                if (imagen != null && imagen.Length > 0)
                {
                    // Crear la carpeta si no existe
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // Generar un nombre único para la imagen
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imagen.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // Guardar la imagen en el servidor
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imagen.CopyToAsync(fileStream);
                    }

                    // Guardar la ruta relativa en la base de datos
                    usuario.ImagenRuta = $"/imagenes/{fileName}";
                }

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
