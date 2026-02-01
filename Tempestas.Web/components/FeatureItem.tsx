import { IoCheckmarkCircle } from 'react-icons/io5';

interface FeatureItemProps {
  text: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  return (
    <div className="flex w-full flex-row items-center gap-3">
      <div className="bg-primary h-2 w-2 shrink-0 rounded-full" />
      <p className="text-text-primary text-sm leading-tight font-medium md:text-base md:leading-normal">
        {text}
      </p>
    </div>
  );
};
