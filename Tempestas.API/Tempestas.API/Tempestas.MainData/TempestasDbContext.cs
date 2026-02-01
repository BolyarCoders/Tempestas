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

        public DbSet<Device> Devices { get; set; } = null!;
        public DbSet<Measurement> Measurements { get; set; } = null!;
        public DbSet<Prediction> Predictions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureDefaults(modelBuilder);
            ConfigureIndexes(modelBuilder);
        }

        private static void ConfigureDefaults(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Device>()
                .Property(d => d.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Device>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Measurement>()
                .Property(m => m.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Prediction>()
                .Property(p => p.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Prediction>()
                .Property(p => p.GeneratedAt)
                .HasDefaultValueSql("now()");
        }

        private static void ConfigureIndexes(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Measurement>()
                .HasIndex(m => new { m.DeviceId, m.MeasuredAt });

            modelBuilder.Entity<Prediction>()
                .HasIndex(p => new { p.DeviceId, p.PredictedFor });
        }
    }
}
