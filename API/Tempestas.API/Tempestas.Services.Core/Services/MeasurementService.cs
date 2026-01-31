using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.Services.Core.Services
{
    public class MeasurementService : IMeasurementService
    {
        private readonly TempestasDbContext _context;

        public MeasurementService(TempestasDbContext context)
        {
            _context = context;
        }
        public async Task<bool> AddMeasurementAsync(Measurement? measurement)
        {
            try
            {
                if(measurement == null)
                {
                    return false;
                }
                else
                {
                    await _context.Measurements.AddAsync(measurement);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<Measurement?> GetLatestMeasurementAsync()
        {
            try
            {
                var measurement = await _context.Measurements
                    .OrderByDescending(x => x.MeasuredAt)
                    .FirstOrDefaultAsync();
                return measurement;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving the measurement.", ex);
            }
        }
    }
}
