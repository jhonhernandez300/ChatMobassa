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

        public async Task EnviarMensaje(MensajeConUsuarioDTO mensajeDto)
        {
            if (mensajeDto == null || mensajeDto.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensajeDto.Contenido))
            {
                throw new ArgumentException("El mensaje recibido no es válido.");
            }

            // Enviar el mensaje directamente a los clientes
            await Clients.All.SendAsync("RecibirMensaje", mensajeDto);
        }

    }
}
