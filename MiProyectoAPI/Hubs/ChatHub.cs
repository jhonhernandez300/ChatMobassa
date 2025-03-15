using Microsoft.AspNetCore.SignalR;

namespace MiProyectoAPI.Hubs
{
    public class ChatHub : Hub
    {
        public async Task EnviarMensaje(string usuario, string mensaje)
        {
            await Clients.All.SendAsync("RecibirMensaje", usuario, mensaje);
        }
    }
}
