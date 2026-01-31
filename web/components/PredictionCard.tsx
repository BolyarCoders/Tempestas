import { Prediction } from "@/lib/mockData";
import { IoTimeOutline } from "react-icons/io5";
import clsx from "clsx";

interface PredictionCardProps {
    prediction: Prediction;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
    return (
        <div className="bg-card rounded-xl p-4 mb-3 border border-white/5 flex flex-row items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <IoTimeOutline size={20} className="text-text-secondary" />
                <span className="font-semibold text-text-primary">{prediction.time}</span>
            </div>

            <div className="flex items-center gap-3">
                <span className="font-semibold text-text-primary">AQI {prediction.aqi}</span>
                <div className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold",
                    prediction.level === "Moderate" ? "bg-status-moderate/20 text-status-moderate" :
                        prediction.level === "Good" ? "bg-status-good/20 text-status-good" : "bg-status-danger/20 text-status-danger"
                )}>
                    {prediction.level}
                </div>
            </div>
        </div>
    );
};
