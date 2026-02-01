"use client";

import React, { useState, useEffect } from "react";
import { DATA } from "@/lib/mockData";
import { MeasurementResponse } from "@/lib/types";
import { AQICard } from "@/components/AQICard";
import { ReadingCard } from "@/components/ReadingCard";
import { TrendChart } from "@/components/TrendChart";
import { PredictionCard } from "@/components/PredictionCard";
import { AlertCard } from "@/components/AlertCard";
import {
  IoSettingsOutline,
  IoThermometerOutline,
  IoWaterOutline,
  IoCloudOutline,
  IoPartlySunnyOutline,
  IoBulbOutline,
} from "react-icons/io5";
import { SettingsModal } from "@/components/SettingsModal";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { trends, predictions } = DATA;
  const [currentConditions, setCurrentConditions] = useState(DATA.current);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tempestas-16da.onrender.com/api/measurements/21c22fce-d945-48cc-a5cd-4a0b4897d160",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: MeasurementResponse = await response.json();

        setCurrentConditions((prev) => ({
          ...prev,
          temperature: data.temperature,
          humidity: data.humidity,
          aqi: data.airQuality,
        }));
      } catch (error) {
        console.error("Failed to fetch measurement data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background-app text-text-primary flex min-h-screen justify-center pb-10">
      <div className="w-full max-w-[1400px] px-5 pt-10 md:pt-14">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between md:mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Tempestas
            </h1>
            <p className="text-text-secondary mt-1 text-sm md:text-base">
              Sofia, Bulgaria
            </p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-card hover:bg-card/80 flex h-11 w-11 items-center justify-center rounded-full transition-colors shadow-sm"
          >
            <IoSettingsOutline size={24} className="text-text-primary" />
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-6 md:col-span-12 lg:col-span-7 xl:col-span-8"
          >
            <AQICard aqi={currentConditions.aqi} />

            {/* Current Conditions */}
            <div>
              <h2 className="text-text-primary mb-4 text-xl font-bold">
                Current Conditions
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <ReadingCard
                  Icon={IoThermometerOutline}
                  value={currentConditions.temperature}
                  unit="°C"
                  label="Temperature"
                />
                <ReadingCard
                  Icon={IoWaterOutline}
                  value={currentConditions.humidity}
                  unit="%"
                  label="Humidity"
                />
                <ReadingCard
                  Icon={IoCloudOutline}
                  value={currentConditions.pm25}
                  label="PM2.5 µg/m³"
                />
                <ReadingCard
                  Icon={IoPartlySunnyOutline}
                  value={currentConditions.pm10}
                  label="PM10 µg/m³"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-6 md:col-span-12 lg:col-span-5 xl:col-span-4"
          >
            {/* Trends */}
            <div className="bg-card/50 rounded-3xl border-white/5 p-0 md:border md:p-6">
              <div className="mb-4 flex items-center justify-between px-1 md:px-0">
                <h2 className="text-text-primary text-xl font-bold">
                  Today&apos;s Trend
                </h2>
                <button className="text-accent hover:text-accent/80 text-sm font-semibold">
                  View All
                </button>
              </div>
              <TrendChart data={trends.hourly} />
            </div>

            {/* Predictions & Alerts Grouping */}
            <div className="bg-card/50 rounded-3xl border-white/5 p-0 md:border md:p-6">
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2 px-1 md:px-0">
                  <IoBulbOutline size={20} className="text-accent" />
                  <h2 className="text-text-primary text-xl font-bold">
                    AI Predictions
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {predictions.map((pred, i) => (
                    <PredictionCard key={i} prediction={pred} />
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <AlertCard />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
