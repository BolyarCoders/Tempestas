import { IoWarning, IoCheckmarkCircle, IoAlertCircle, IoCloseCircle } from 'react-icons/io5';

interface AQICardProps {
  aqi: number;
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) {
    return {
      label: 'Good',
      icon: <IoCheckmarkCircle size={32} className="text-white" />,
      description: 'Air quality is excellent',
      colorClass: 'bg-status-good',
    };
  } else if (aqi <= 100) {
    return {
      label: 'Moderate',
      icon: <IoWarning size={32} className="text-white" />,
      description: 'Acceptable for most people',
      colorClass: 'bg-status-moderate',
    };
  } else if (aqi <= 150) {
    return {
      label: 'Unhealthy',
      icon: <IoAlertCircle size={32} className="text-white" />,
      description: 'Sensitive groups may be affected',
      colorClass: 'bg-status-unhealthy',
    };
  } else {
    return {
      label: 'Dangerous',
      icon: <IoCloseCircle size={32} className="text-white" />,
      description: 'Everyone may experience health effects',
      colorClass: 'bg-status-danger',
    };
  }
};

export const AQICard: React.FC<AQICardProps> = ({ aqi }) => {
  const status = getAQIStatus(aqi);

  return (
    <div className="shadow-primary/20 from-primary to-accent relative mb-6 w-full overflow-hidden rounded-3xl bg-linear-to-br p-7 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        {status.icon}
        <span className="text-xl font-semibold text-white">{status.label}</span>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-7xl font-extrabold tracking-tighter text-white">{aqi}</span>
        <span className="text-2xl font-semibold text-white/90">AQI</span>
      </div>

      <p className="mb-6 text-base font-medium text-white/90">{status.description}</p>

      {/* Color Indicator Bar */}
      <div className="flex h-1.5 w-full flex-row gap-0.5 overflow-hidden rounded-full bg-black/10 p-0.5">
        <div className="bg-status-good flex-1 rounded-l-full" />
        <div className="bg-status-moderate flex-1" />
        <div className="bg-status-unhealthy flex-1" />
        <div className="bg-status-danger flex-1 rounded-r-full" />
      </div>
    </div>
  );
};
