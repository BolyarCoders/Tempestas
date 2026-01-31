"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FeatureItem } from "@/components/FeatureItem";
import { motion } from "framer-motion";

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-app flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Background decoration if needed matching mobile's dark theme/image */}

      <div className="w-full max-w-lg flex flex-col items-center gap-8 md:gap-12 z-10">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 mb-4"
        >
          <div className="w-40 h-40 md:w-52 md:h-52 relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 absolute blur-xl"></div>
            <h1 className="text-6xl md:text-8xl">🌪️</h1>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-widest uppercase">Tempestas</h1>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6 md:gap-8 px-4 w-full"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-text-primary leading-tight">
            Monitor. Predict. <br className="hidden md:block" />Stay Safe.
          </h2>

          <p className="text-sm md:text-lg text-text-secondary text-center max-w-md">
            Tempestas shows you real-time air quality, temperature, and humidity.
            Get alerts and advice to protect yourself from pollution.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-4 items-start w-full max-w-xs md:max-w-sm mt-4"
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
          className="w-full max-w-xs md:max-w-sm mt-6"
        >
          <button
            onClick={() => router.push("/onboarding")}
            className="btn btn-block border-none bg-linear-to-r from-accent to-primary text-white text-lg font-bold rounded-2xl h-14 md:h-16 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-transform"
          >
            Continue
            <span className="ml-2 text-xl">→</span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
