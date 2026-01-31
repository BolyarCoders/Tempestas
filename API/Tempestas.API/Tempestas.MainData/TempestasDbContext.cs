using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Tempestas.MainData.Models;

namespace Tempestas.MainData
{
    public class TempestasDbContext : DbContext
    {
        public TempestasDbContext(DbContextOptions<TempestasDbContext> options) : base(options)
        {
        }

        public DbSet<Models.Device> Devices { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureDefaults(modelBuilder);
        }

        private static void ConfigureDefaults(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Device>()
                .Property(d => d.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Device>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("now()");
        }
    }
}
