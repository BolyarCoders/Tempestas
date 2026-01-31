import { IconType } from 'react-icons';

interface ReadingCardProps {
  value: string | number;
  unit?: string;
  label: string;
  Icon: IconType;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ value, unit, label, Icon }) => {
  return (
    <div className="bg-card flex aspect-square flex-col items-center justify-center rounded-2xl border border-white/5 p-5 shadow-sm">
      <Icon size={28} className="text-accent mb-3" />
      <div className="mb-1 flex items-end gap-0.5">
        <span className="text-text-primary text-2xl font-bold md:text-3xl">{value}</span>
        {unit && <span className="text-text-secondary mb-1.5 text-sm font-medium">{unit}</span>}
      </div>
      <span className="text-text-secondary text-center text-xs font-medium">{label}</span>
    </div>
  );
};
