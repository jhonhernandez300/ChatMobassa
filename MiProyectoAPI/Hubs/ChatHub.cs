using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Data;
using MiProyectoAPI.Models;
using System.Threading.Tasks;

namespace MiProyectoAPI.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task EnviarMensaje(Mensaje mensaje)
        {
            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {
                throw new ArgumentException("El mensaje recibido no es válido.");
            }

            // Obtener el nombre del usuario antes de enviarlo
            var usuario = await _context.Usuarios
                .Where(u => u.UsuarioId == mensaje.UsuarioId)
                .Select(u => u.Nombre)
                .FirstOrDefaultAsync();

            if (usuario == null)
            {
                throw new ArgumentException("Usuario no encontrado.");
            }

            // Crear DTO con el nombre del usuario
            var mensajeDto = new MensajeConUsuarioNombreDto
            {
                id = mensaje.Id,
                contenido = mensaje.Contenido,
                fechaYHora = mensaje.FechaYHora,
                usuarioId = mensaje.UsuarioId,
                usuarioNombre = usuario // Agregar el nombre
            };

            await Clients.All.SendAsync("RecibirMensaje", mensajeDto);
        }

    }
}
