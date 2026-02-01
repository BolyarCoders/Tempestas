import clsx from "clsx";

interface TrendChartProps {
  data: number[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const maxVal = Math.max(...data);

  return (
    <div className="bg-card rounded-2xl border border-white/5 p-5 shadow-xl">
      <div className="flex h-32 items-end justify-between gap-2 md:gap-4">
        {data.map((value, index) => {
          const height = (value / maxVal) * 100;
          const isGood = value <= 50;

          return (
            <div
              key={index}
              className="group flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {value}
              </span>

              <div className="flex h-full w-full items-end justify-center">
                <div
                  className={clsx(
                    "min-h-[4px] w-full max-w-[20px] rounded-t-sm transition-all duration-500",
                    isGood ? "bg-status-good" : "bg-status-moderate",
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="text-text-secondary mt-2 text-[10px] font-medium">
                {8 + index * 2}:00
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
