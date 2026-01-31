'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FeatureItem } from '@/components/FeatureItem';
import { motion } from 'framer-motion';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="bg-background-app relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      {/* Background decoration if needed matching mobile's dark theme/image */}

      <div className="z-10 flex w-full max-w-lg flex-col items-center gap-8 md:gap-12">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-4 flex flex-col items-center gap-4"
        >
          <div className="relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
            <div className="from-primary to-accent absolute h-32 w-32 rounded-full bg-gradient-to-tr opacity-20 blur-xl"></div>
            <h1 className="text-6xl md:text-8xl">🌪️</h1>
          </div>

          <h1 className="text-text-primary text-4xl font-black tracking-widest uppercase md:text-5xl">
            Tempestas
          </h1>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex w-full flex-col items-center gap-6 px-4 md:gap-8"
        >
          <h2 className="text-text-primary text-center text-2xl leading-tight font-extrabold md:text-3xl">
            Monitor. Predict. <br className="hidden md:block" />
            Stay Safe.
          </h2>

          <p className="text-text-secondary max-w-md text-center text-sm md:text-lg">
            Tempestas shows you real-time air quality, temperature, and humidity. Get alerts and
            advice to protect yourself from pollution.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 flex w-full max-w-xs flex-col items-start gap-4 md:max-w-sm"
          >
            <FeatureItem text="Real-time air quality, temperature, and humidity" />
            <FeatureItem text="Predictions for the next hours" />
            <FeatureItem text="Notifications when to close your windows" />
          </motion.div>
        </motion.div>

        {/* Button Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 w-full max-w-xs md:max-w-sm"
        >
          <button
            onClick={() => router.push('/onboarding')}
            className="btn btn-block from-accent to-primary shadow-primary/30 hover:shadow-primary/50 h-14 rounded-2xl border-none bg-linear-to-r text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] md:h-16"
          >
            Continue
            <span className="ml-2 text-xl">→</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
