using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Data;
using MiProyectoAPI.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;

namespace MiProyectoAPI.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IServiceScopeFactory _scopeFactory; // 🔹 Cambio: Reemplazar AppDbContext con IServiceScopeFactory
        private readonly IHttpContextAccessor _httpContextAccessor;

        // 🔹 Cambio: Inyectar IServiceScopeFactory en lugar de AppDbContext
        public ChatHub(IServiceScopeFactory scopeFactory, IHttpContextAccessor httpContextAccessor)
        {
            _scopeFactory = scopeFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        // Método OnConnectedAsync para acceder a HttpContext
        public override async Task OnConnectedAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
                Console.WriteLine($"Usuario conectado desde: {userAgent}");
            }

            await base.OnConnectedAsync();
        }

        public async Task EnviarMensaje(Mensaje mensaje)
        {
            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {
                throw new ArgumentException("El mensaje recibido no es válido.");
            }

            // 🔹 Cambio: Crear un alcance (scope) para obtener una instancia de `AppDbContext`
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Obtener el nombre del usuario antes de enviarlo
                var usuario = await dbContext.Usuarios
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
            } // 🔹 Fin del alcance (scope)
        }
    }
}
