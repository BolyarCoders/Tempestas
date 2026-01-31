import { HealthCondition } from "@/lib/mockData";
import { IoFitnessOutline, IoFlowerOutline, IoPulseOutline, IoHeartOutline, IoMedkitOutline, IoPeopleOutline, IoAccessibilityOutline } from "react-icons/io5"; // Importing icons manually for now or mapping them
import clsx from "clsx";

// Helper to map icon string to React Icon component
const getIcon = (iconName: string) => {
    switch (iconName) {
        case "fitness-outline": return <IoFitnessOutline size={24} />;
        case "flower-outline": return <IoFlowerOutline size={24} />;
        case "pulse-outline": return <IoPulseOutline size={24} />;
        case "heart-outline": return <IoHeartOutline size={24} />;
        case "medkit-outline": return <IoMedkitOutline size={24} />;
        case "people-outline": return <IoPeopleOutline size={24} />;
        case "accessibility-outline": return <IoAccessibilityOutline size={24} />;
        default: return <IoFitnessOutline size={24} />;
    }
};

interface ConditionCardProps {
    condition: HealthCondition;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition, isSelected, onToggle }) => {
    return (
        <div
            onClick={() => onToggle(condition.id)}
            className={clsx(
                "relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer bg-card group hover:border-primary/50",
                isSelected ? "border-primary bg-card" : "border-white/5 bg-card"
            )}
        >
            <div className="flex items-center gap-3 flex-1">
                <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary/20 text-primary" : "bg-text-secondary/10 text-text-secondary group-hover:text-primary/70"
                )}>
                    {getIcon(condition.icon)}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-text-primary text-base md:text-lg">{condition.name}</span>
                    <span className="text-text-secondary text-xs md:text-sm leading-tight">{condition.description}</span>
                </div>
            </div>

            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => { }}
                className="toggle toggle-primary pointer-events-none"
            />
        </div>
    );
};
