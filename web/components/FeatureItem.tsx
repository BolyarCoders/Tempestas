import { IoCheckmarkCircle } from "react-icons/io5";

interface FeatureItemProps {
    text: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
    return (
        <div className="flex flex-row items-center gap-3 w-full">
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <p className="text-text-primary font-medium text-sm md:text-base leading-tight md:leading-normal">
                {text}
            </p>
        </div>
    );
};
