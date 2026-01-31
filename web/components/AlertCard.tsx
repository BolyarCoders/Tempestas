import { IoNotificationsOutline, IoChevronForward } from "react-icons/io5";
import { useRouter } from "next/navigation";

export const AlertCard: React.FC = () => {
    const router = useRouter();

    return (
        <div className="bg-card rounded-2xl p-5 mt-4 border border-status-good/20 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <IoNotificationsOutline size={24} className="text-status-good" />
                <h3 className="text-lg font-semibold text-text-primary">Air Quality Alert</h3>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-4">
                No alerts at this time. You&apos;ll be notified when air quality changes.
            </p>

            <button
                onClick={() => router.push("/alerts")}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 py-3 rounded-xl text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
            >
                Configure Alerts
                <IoChevronForward size={16} />
            </button>
        </div>
    );
};
