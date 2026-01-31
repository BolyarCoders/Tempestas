import { IoNotificationsOutline, IoChevronForward } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export const AlertCard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-card border-status-good/20 mt-4 rounded-2xl border p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <IoNotificationsOutline size={24} className="text-status-good" />
        <h3 className="text-text-primary text-lg font-semibold">Air Quality Alert</h3>
      </div>

      <p className="text-text-secondary mb-4 text-sm leading-relaxed">
        No alerts at this time. You&apos;ll be notified when air quality changes.
      </p>

      <button
        onClick={() => router.push('/alerts')}
        className="bg-primary/10 text-primary hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors"
      >
        Configure Alerts
        <IoChevronForward size={16} />
      </button>
    </div>
  );
};
