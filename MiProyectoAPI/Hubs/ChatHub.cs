using Microsoft.AspNetCore.SignalR;
using MiProyectoAPI.Models;
using System.Threading.Tasks;

namespace MiProyectoAPI.Hubs
{
    public class ChatHub : Hub
    {
        public async Task EnviarMensaje(Mensaje mensaje)
        {
            Console.WriteLine($"[SignalR] Mensaje recibido: UsuarioId={mensaje.UsuarioId}, Contenido={mensaje.Contenido}");

            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {
                throw new ArgumentException("El mensaje recibido no es válido.");
            }

            await Clients.All.SendAsync("RecibirMensaje", mensaje);
        }
    }
}
