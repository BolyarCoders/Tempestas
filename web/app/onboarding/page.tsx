'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DATA } from '@/lib/mockData';
import { ConditionCard } from '@/components/ConditionCard';
import { IoShieldCheckmark, IoInformationCircle, IoArrowForward } from 'react-icons/io5';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Onboarding() {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCondition = (id: string) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = () => {
    console.log('Selected conditions:', selectedConditions);
    router.push('/home');
  };

  const hasSelections = Object.values(selectedConditions).some((v) => v);

  return (
    <div className="bg-background-app text-text-primary flex min-h-screen flex-col items-center px-4 py-6 md:px-0 md:py-10">
      <div className="relative flex w-full max-w-lg flex-1 flex-col pb-24 md:pb-0">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="from-primary to-accent shadow-primary/40 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br shadow-lg">
            <IoShieldCheckmark size={48} className="text-white" />
          </div>
          <h1 className="text-center text-2xl font-extrabold md:text-3xl">
            Personalize Your Protection
          </h1>
          <p className="text-text-secondary px-4 text-center text-sm md:text-base">
            Help us tailor air quality alerts to your health needs. Select any conditions that apply
            to you or your household.
          </p>
        </div>

        {/* List */}
        <div className="mb-6 flex w-full flex-col gap-3 px-2">
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
        <div className="bg-primary/10 border-primary/30 mx-2 mb-6 flex flex-row items-start gap-3 rounded-xl border p-4">
          <IoInformationCircle size={20} className="text-accent mt-0.5 shrink-0" />
          <p className="text-text-secondary text-sm leading-relaxed">
            This information helps us send you more relevant alerts and recommendations. You can
            change these settings anytime.
          </p>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleContinue}
          className="text-text-secondary hover:text-primary mb-6 self-center text-sm font-semibold transition-colors"
        >
          {hasSelections ? 'None of these apply' : 'Skip for now'}
        </button>
      </div>

      {/* Fixed Bottom Button on Mobile, Static on Desktop */}
      <div className="bg-background-app fixed right-0 bottom-0 left-0 z-20 border-t border-white/5 p-5 backdrop-blur-md md:relative md:mt-4 md:w-full md:max-w-lg md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button
          onClick={handleContinue}
          disabled={!hasSelections}
          className={clsx(
            'btn btn-block h-14 rounded-2xl border-none text-base font-bold text-white shadow-lg transition-all',
            hasSelections
              ? 'from-primary to-accent shadow-primary/30 bg-linear-to-r hover:scale-[1.02]'
              : 'cursor-not-allowed bg-slate-700/50 text-slate-400',
          )}
        >
          {hasSelections ? 'Continue' : 'Select at least one condition'}
          {hasSelections && <IoArrowForward size={20} />}
        </button>
      </div>
    </div>
  );
}
