using Microsoft.EntityFrameworkCore;
using Tempestas.MainData;
using Tempestas.Services.Core;
using Tempestas.Services.Core.Interfaces;
using Tempestas.Services.Core.Services;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(int.Parse(port));
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TempestasDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IMeasurementService, MeasurementService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddHttpClient<IPredictionService, PredictionService>(); 


var app = builder.Build();

app.UseCors("AllowAll"); // ? Fixed - matches the policy name

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();