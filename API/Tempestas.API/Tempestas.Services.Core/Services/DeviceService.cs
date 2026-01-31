using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.Services.Core.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly TempestasDbContext _context;
        public DeviceService(TempestasDbContext context)
        {
            _context = context;
        }
        public async Task<bool> AddDeviceAsync(Device? device)
        {
            try
            {
                if (device == null)
                {
                    return false;
                }
                else
                {
                    await _context.Devices.AddAsync(device);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<Device?> GetDeviceInfoAsync(string? DeviceId)
        {
            try
            {
                if (string.IsNullOrEmpty(DeviceId))
                {
                    return null!;
                }
                else
                {
                    Device? device = await _context.Devices.FindAsync(Guid.Parse(DeviceId));
                    return device;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while getting the prediction for the device.", ex);
            }

        }
    }
}
