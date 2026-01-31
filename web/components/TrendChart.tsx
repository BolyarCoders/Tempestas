import clsx from "clsx";

interface TrendChartProps {
    data: number[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    const maxVal = Math.max(...data);

    return (
        <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
            <div className="flex justify-between items-end h-32 gap-2 md:gap-4">
                {data.map((value, index) => {
                    const height = (value / maxVal) * 100;
                    const isGood = value <= 50;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity mb-1">{value}</span>

                            <div className="w-full h-full flex items-end justify-center">
                                <div
                                    className={clsx(
                                        "w-full max-w-[20px] rounded-t-sm transition-all duration-500 min-h-[4px]",
                                        isGood ? "bg-status-good" : "bg-status-moderate"
                                    )}
                                    style={{ height: `${height}%` }}
                                />
                            </div>

                            <span className="text-[10px] text-text-secondary mt-2 font-medium">
                                {8 + index * 2}:00
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
