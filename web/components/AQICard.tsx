import { IoWarning, IoCheckmarkCircle, IoAlertCircle, IoCloseCircle } from "react-icons/io5";


interface AQICardProps {
    aqi: number;
}

const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) {
        return {
            label: "Good",
            icon: <IoCheckmarkCircle size={32} className="text-white" />,
            description: "Air quality is excellent",
            colorClass: "bg-status-good"
        };
    } else if (aqi <= 100) {
        return {
            label: "Moderate",
            icon: <IoWarning size={32} className="text-white" />,
            description: "Acceptable for most people",
            colorClass: "bg-status-moderate"
        };
    } else if (aqi <= 150) {
        return {
            label: "Unhealthy",
            icon: <IoAlertCircle size={32} className="text-white" />,
            description: "Sensitive groups may be affected",
            colorClass: "bg-status-unhealthy"
        };
    } else {
        return {
            label: "Dangerous",
            icon: <IoCloseCircle size={32} className="text-white" />,
            description: "Everyone may experience health effects",
            colorClass: "bg-status-danger"
        };
    }
};

export const AQICard: React.FC<AQICardProps> = ({ aqi }) => {
    const status = getAQIStatus(aqi);

    return (
        <div className="w-full rounded-3xl p-7 mb-6 shadow-xl shadow-primary/20 bg-linear-to-br from-primary to-accent relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                {status.icon}
                <span className="text-xl font-semibold text-white">{status.label}</span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-7xl font-extrabold text-white tracking-tighter">{aqi}</span>
                <span className="text-2xl font-semibold text-white/90">AQI</span>
            </div>

            <p className="text-base text-white/90 mb-6 font-medium">{status.description}</p>

            {/* Color Indicator Bar */}
            <div className="flex flex-row h-1.5 rounded-full overflow-hidden gap-0.5 w-full bg-black/10 p-0.5">
                <div className="flex-1 bg-status-good rounded-l-full" />
                <div className="flex-1 bg-status-moderate" />
                <div className="flex-1 bg-status-unhealthy" />
                <div className="flex-1 bg-status-danger rounded-r-full" />
            </div>
        </div>
    );
};
