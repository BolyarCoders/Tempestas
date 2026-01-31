"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DATA } from "@/lib/mockData";
import { ConditionCard } from "@/components/ConditionCard";
import { IoShieldCheckmark, IoInformationCircle, IoArrowForward } from "react-icons/io5";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Onboarding() {
    const router = useRouter();
    const [selectedConditions, setSelectedConditions] = useState<{ [key: string]: boolean }>({});

    const toggleCondition = (id: string) => {
        setSelectedConditions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleContinue = () => {
        console.log("Selected conditions:", selectedConditions);
        router.push("/home");
    };

    const hasSelections = Object.values(selectedConditions).some((v) => v);

    return (
        <div className="min-h-screen bg-background-app text-text-primary flex flex-col items-center py-6 px-4 md:py-10 md:px-0">
            <div className="w-full max-w-lg flex flex-col flex-1 pb-24 md:pb-0 relative">

                {/* Header */}
                <div className="flex flex-col items-center mb-8 gap-4">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/40 mb-2">
                        <IoShieldCheckmark size={48} className="text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-center">Personalize Your Protection</h1>
                    <p className="text-text-secondary text-center text-sm md:text-base px-4">
                        Help us tailor air quality alerts to your health needs. Select any conditions that apply to you or your household.
                    </p>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3 w-full px-2 mb-6">
                    {DATA.conditions.map((condition, idx) => (
                        <motion.div
                            key={condition.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <ConditionCard
                                condition={condition}
                                isSelected={!!selectedConditions[condition.id]}
                                onToggle={toggleCondition}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="mx-2 bg-primary/10 border border-primary/30 rounded-xl p-4 flex flex-row items-start gap-3 mb-6">
                    <IoInformationCircle size={20} className="text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary leading-relaxed">
                        This information helps us send you more relevant alerts and recommendations. You can change these settings anytime.
                    </p>
                </div>

                {/* Skip Button */}
                <button
                    onClick={handleContinue}
                    className="text-text-secondary text-sm font-semibold hover:text-primary transition-colors self-center mb-6"
                >
                    {hasSelections ? "None of these apply" : "Skip for now"}
                </button>

            </div>

            {/* Fixed Bottom Button on Mobile, Static on Desktop */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-background-app border-t border-white/5 md:relative md:border-none md:bg-transparent md:w-full md:max-w-lg md:p-0 md:mt-4 backdrop-blur-md md:backdrop-blur-none z-20">
                <button
                    onClick={handleContinue}
                    disabled={!hasSelections}
                    className={clsx(
                        "btn btn-block border-none text-white text-base font-bold rounded-2xl h-14 shadow-lg transition-all",
                        hasSelections
                            ? "bg-linear-to-r from-primary to-accent shadow-primary/30 hover:scale-[1.02]"
                            : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                    )}
                >
                    {hasSelections ? "Continue" : "Select at least one condition"}
                    {hasSelections && <IoArrowForward size={20} />}
                </button>
            </div>
        </div>
    );
}
