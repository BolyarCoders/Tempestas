using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData;
using Tempestas.MainData.Models;

namespace Tempestas.Services.Core.Interfaces
{
    public interface IDeviceService
    {
        public Task<Device?> GetDeviceInfoAsync(string DeviceId);

        public Task<bool> AddDeviceAsync(Device device);
    }
}
