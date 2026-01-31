import { IconType } from "react-icons";


interface ReadingCardProps {
    value: string | number;
    unit?: string;
    label: string;
    Icon: IconType;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ value, unit, label, Icon }) => {
    return (
        <div className="bg-card rounded-2xl p-5 flex flex-col items-center justify-center border border-white/5 aspect-square shadow-sm">
            <Icon size={28} className="text-accent mb-3" />
            <div className="flex items-end gap-0.5 mb-1">
                <span className="text-2xl md:text-3xl font-bold text-text-primary">{value}</span>
                {unit && <span className="text-sm font-medium text-text-secondary mb-1.5">{unit}</span>}
            </div>
            <span className="text-xs text-text-secondary font-medium text-center">{label}</span>
        </div>
    );
};
