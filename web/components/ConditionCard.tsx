import { HealthCondition } from "@/lib/mockData";
import {
  IoFitnessOutline,
  IoFlowerOutline,
  IoPulseOutline,
  IoHeartOutline,
  IoMedkitOutline,
  IoPeopleOutline,
  IoAccessibilityOutline,
} from "react-icons/io5"; // Importing icons manually for now or mapping them
import clsx from "clsx";

// Helper to map icon string to React Icon component
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "fitness-outline":
      return <IoFitnessOutline size={24} />;
    case "flower-outline":
      return <IoFlowerOutline size={24} />;
    case "pulse-outline":
      return <IoPulseOutline size={24} />;
    case "heart-outline":
      return <IoHeartOutline size={24} />;
    case "medkit-outline":
      return <IoMedkitOutline size={24} />;
    case "people-outline":
      return <IoPeopleOutline size={24} />;
    case "accessibility-outline":
      return <IoAccessibilityOutline size={24} />;
    default:
      return <IoFitnessOutline size={24} />;
  }
};

interface ConditionCardProps {
  condition: HealthCondition;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({
  condition,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      onClick={() => onToggle(condition.id)}
      className={clsx(
        "bg-card group hover:border-primary/50 relative flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 shadow-md hover:shadow-xl",
        isSelected ? "border-primary bg-card" : "bg-card border-white/5",
      )}
    >
      <div className="flex flex-1 items-center gap-3">
        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            isSelected
              ? "bg-primary/20 text-primary"
              : "bg-text-secondary/10 text-text-secondary group-hover:text-primary/70",
          )}
        >
          {getIcon(condition.icon)}
        </div>
        <div className="flex flex-col">
          <span className="text-text-primary text-base font-semibold md:text-lg">
            {condition.name}
          </span>
          <span className="text-text-secondary text-xs leading-tight md:text-sm">
            {condition.description}
          </span>
        </div>
      </div>

      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {}}
        className="toggle toggle-primary pointer-events-none"
      />
    </div>
  );
};
