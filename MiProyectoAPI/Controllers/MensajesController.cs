﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("ObtenerMensajesConUsuario")]
        public async Task<IActionResult> ObtenerMensajesConUsuario()
        {
            var mensajes = await _context.Mensajes
                .Include(m => m.Usuario)
                .Select(m => new MensajeConUsuarioDTO
                {
                    Id = m.Id,
                    Contenido = m.Contenido,
                    FechaYHora = m.FechaYHora,
                    UsuarioId = m.UsuarioId,
                    UsuarioNombre = m.Usuario!.Nombre,
                    ImagenRuta = m.Usuario!.ImagenRuta
                })
                .ToListAsync();

            return Ok(mensajes);
        }

        [HttpGet("ObtenerMensajes")]
        public async Task<IActionResult> ObtenerMensajes()
        {
            try
            {
                var mensajes = await _context.Mensajes
                    .Include(m => m.Usuario) // Trae la relación con Usuario
                    .Select(m => new MensajeConUsuarioNombreDto
                    {
                        id = m.Id,
                        contenido = m.Contenido,
                        fechaYHora = m.FechaYHora,
                        usuarioId = m.UsuarioId,
                        usuarioNombre = m.Usuario.Nombre
                    })
                    .ToListAsync();

                return Ok(mensajes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los mensajes: {ex.Message}");
            }
        }

        [HttpPost("GuardarMensaje")]
        public async Task<ActionResult<Mensaje>> GuardarMensaje([FromBody] Mensaje mensaje)
        {   

            if (mensaje == null || mensaje.UsuarioId <= 0 || string.IsNullOrWhiteSpace(mensaje.Contenido))
            {                
                return BadRequest(new { error = "Datos inválidos." });
            }

            mensaje.FechaYHora = DateTime.UtcNow;
            _context.Mensajes.Add(mensaje);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerMensajes), new { id = mensaje.Id }, mensaje);
        }

    }
}
