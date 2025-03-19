using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Controllers;
using MiProyectoAPI.Data;
using MiProyectoAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace xUnitTestProject.Controllers
{
    public class MensajesControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB")
                .Options;

            var dbContext = new AppDbContext(options);

            // Agregar datos de prueba
            dbContext.Usuarios.Add(new Usuario { 
                UsuarioId = 1, 
                Nombre = "Juan", 
                ImagenRuta = "imagen1.jpg",
                Correo = "juan@gmail.com",
                Password = "Juan0101*",
                Apodo = "Juancho"
            });
            dbContext.Mensajes.Add(new Mensaje
            {
                Id = 1,
                Contenido = "Hola Mundo",
                FechaYHora = DateTime.Now,
                UsuarioId = 1,
                gifUrl = "gif1.gif",
                videoUrl = "video1.mp4"
            });

            dbContext.SaveChanges();
            return dbContext;
        }

        [Fact]
        public async Task ObtenerMensajesConUsuario_DeberiaRetornarListaDeMensajes()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            var controller = new MensajesController(dbContext);

            // Act
            var result = await controller.ObtenerMensajesConUsuario();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var mensajes = Assert.IsType<List<MensajeConUsuarioDTO>>(okResult.Value);

            Assert.Single(mensajes);
            Assert.Equal("Hola Mundo", mensajes[0].Contenido);
            Assert.Equal("Juan", mensajes[0].UsuarioNombre);
            Assert.Equal("gif1.gif", mensajes[0].gifUrl);
        }
    }
}
