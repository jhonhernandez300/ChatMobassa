using Microsoft.EntityFrameworkCore;
using MiProyectoAPI.Data;
using MiProyectoAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString")));

builder.Services.AddControllers();
builder.Services.AddSignalR();

// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
var corsPolicyName = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName,
        builder => builder
            .WithOrigins("http://localhost:4200")  // Permitir solo el frontend
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Permitir credenciales como cookies o autenticación
});

// Registrar IHttpContextAccessor para acceder al contexto HTTP en servicios
builder.Services.AddHttpContextAccessor();

// Registrar ChatHub como un servicio singleton si necesitas inyectarlo en otros servicios
builder.Services.AddSingleton<ChatHub>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(corsPolicyName);
app.UseAuthorization();
app.MapHub<ChatHub>("/chathub");

app.MapControllers();

app.Run();
