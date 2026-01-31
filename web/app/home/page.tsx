"use client";

import React, { useState } from "react";
import { DATA } from "@/lib/mockData";
import { AQICard } from "@/components/AQICard";
import { ReadingCard } from "@/components/ReadingCard";
import { TrendChart } from "@/components/TrendChart";
import { PredictionCard } from "@/components/PredictionCard";
import { AlertCard } from "@/components/AlertCard";
import { IoSettingsOutline, IoThermometerOutline, IoWaterOutline, IoCloudOutline, IoPartlySunnyOutline, IoBulbOutline } from "react-icons/io5";

export default function Home() {
    const { current, trends, predictions } = DATA;

    return (
        <div className="min-h-screen bg-background-app text-text-primary flex justify-center pb-10">
            <div className="w-full px-5 pt-10 md:pt-14 max-w-[1400px]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Tempestas</h1>
                        <p className="text-sm md:text-base text-text-secondary mt-1">Sofia, Bulgaria</p>
                    </div>
                    <button className="w-11 h-11 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
                        <IoSettingsOutline size={24} className="text-text-primary" />
                    </button>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

                    <div className="md:col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <AQICard aqi={current.aqi} />

                        {/* Current Conditions */}
                        <div>
                            <h2 className="text-xl font-bold text-text-primary mb-4">Current Conditions</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                                <ReadingCard
                                    Icon={IoCloudOutline}
                                    value={current.pm25}
                                    label="PM2.5 µg/m³"
                                />
                                <ReadingCard
                                    Icon={IoPartlySunnyOutline}
                                    value={current.pm10}
                                    label="PM10 µg/m³"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-6">

                        {/* Trends */}
                        <div className="bg-card/50 p-0 md:p-6 rounded-3xl md:border border-white/5">
                            <div className="flex justify-between items-center mb-4 px-1 md:px-0">
                                <h2 className="text-xl font-bold text-text-primary">Today&apos;s Trend</h2>
                                <button className="text-sm font-semibold text-accent hover:text-accent/80">View All</button>
                            </div>
                            <TrendChart data={trends.hourly} />
                        </div>

                        {/* Predictions & Alerts Grouping */}
                        <div className="bg-card/50 p-0 md:p-6 rounded-3xl md:border border-white/5">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4 px-1 md:px-0">
                                    <IoBulbOutline size={20} className="text-accent" />
                                    <h2 className="text-xl font-bold text-text-primary">AI Predictions</h2>
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
