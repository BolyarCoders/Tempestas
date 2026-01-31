'use client';

import React, { useState } from 'react';
import { DATA } from '@/lib/mockData';
import { AQICard } from '@/components/AQICard';
import { ReadingCard } from '@/components/ReadingCard';
import { TrendChart } from '@/components/TrendChart';
import { PredictionCard } from '@/components/PredictionCard';
import { AlertCard } from '@/components/AlertCard';
import {
  IoSettingsOutline,
  IoThermometerOutline,
  IoWaterOutline,
  IoCloudOutline,
  IoPartlySunnyOutline,
  IoBulbOutline,
} from 'react-icons/io5';

export default function Home() {
  const { current, trends, predictions } = DATA;

  return (
    <div className="bg-background-app text-text-primary flex min-h-screen justify-center pb-10">
      <div className="w-full max-w-[1400px] px-5 pt-10 md:pt-14">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between md:mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Tempestas</h1>
            <p className="text-text-secondary mt-1 text-sm md:text-base">Sofia, Bulgaria</p>
          </div>
          <button className="bg-card hover:bg-card/80 flex h-11 w-11 items-center justify-center rounded-full transition-colors">
            <IoSettingsOutline size={24} className="text-text-primary" />
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 md:col-span-12 lg:col-span-7 xl:col-span-8">
            <AQICard aqi={current.aqi} />

            {/* Current Conditions */}
            <div>
              <h2 className="text-text-primary mb-4 text-xl font-bold">Current Conditions</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <ReadingCard
                  Icon={IoThermometerOutline}
                  value={current.temperature}
                  unit="°C"
                  label="Temperature"
                />
                <ReadingCard
                  Icon={IoWaterOutline}
                  value={current.humidity}
                  unit="%"
                  label="Humidity"
                />
                <ReadingCard Icon={IoCloudOutline} value={current.pm25} label="PM2.5 µg/m³" />
                <ReadingCard Icon={IoPartlySunnyOutline} value={current.pm10} label="PM10 µg/m³" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:col-span-12 lg:col-span-5 xl:col-span-4">
            {/* Trends */}
            <div className="bg-card/50 rounded-3xl border-white/5 p-0 md:border md:p-6">
              <div className="mb-4 flex items-center justify-between px-1 md:px-0">
                <h2 className="text-text-primary text-xl font-bold">Today&apos;s Trend</h2>
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
                  <h2 className="text-text-primary text-xl font-bold">AI Predictions</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}
