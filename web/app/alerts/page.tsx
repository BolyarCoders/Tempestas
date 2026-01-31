"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoSparkles, IoShieldCheckmark, IoNotifications, IoAlertCircle, IoOptions, IoChevronDown, IoChevronUp, IoPhonePortrait, IoVolumeHigh, IoTime, IoCheckmark } from "react-icons/io5";
import clsx from "clsx";

type AlertLevel = "auto" | "high" | "medium" | "low" | "custom";

interface AlertPreset {
    id: AlertLevel;
    name: string;
    description: string;
    icon: React.ReactNode;
    aqiThreshold?: number;
    colorClass: string;
    colorHex: string;
}

const alertPresets: AlertPreset[] = [
    {
        id: "auto",
        name: "Auto (Recommended)",
        description: "Based on your health profile",
        icon: <IoSparkles size={24} />,
        colorClass: "text-accent",
        colorHex: "#22D3EE",
    },
    {
        id: "high",
        name: "High Sensitivity",
        description: "Alert at AQI 50+ (Good to Moderate)",
        icon: <IoShieldCheckmark size={24} />,
        aqiThreshold: 50,
        colorClass: "text-status-good",
        colorHex: "#22C55E",
    },
    {
        id: "medium",
        name: "Medium Sensitivity",
        description: "Alert at AQI 100+ (Moderate to Unhealthy)",
        icon: <IoNotifications size={24} />,
        aqiThreshold: 100,
        colorClass: "text-status-moderate",
        colorHex: "#EAB308",
    },
    {
        id: "low",
        name: "Low Sensitivity",
        description: "Alert at AQI 150+ (Unhealthy)",
        icon: <IoAlertCircle size={24} />,
        aqiThreshold: 150,
        colorClass: "text-status-unhealthy",
        colorHex: "#F97316",
    },
];

export default function Alerts() {
    const router = useRouter();
    const [selectedLevel, setSelectedLevel] = useState<AlertLevel>("auto");
    const [isCustomExpanded, setIsCustomExpanded] = useState(false);
    const [customThreshold, setCustomThreshold] = useState(75);

    // Mock settings state
    const [pushEnabled, setPushEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    const handleCustomPress = () => {
        setSelectedLevel("custom");
        setIsCustomExpanded(!isCustomExpanded);
    };

    const getThresholdColorClass = (value: number) => {
        if (value <= 50) return "text-status-good";
        if (value <= 100) return "text-status-moderate";
        if (value <= 150) return "text-status-unhealthy";
        return "text-status-danger";
    };

    const getThresholdLabel = (value: number) => {
        if (value <= 50) return "Good";
        if (value <= 100) return "Moderate";
        if (value <= 150) return "Unhealthy";
        return "Dangerous";
    };

    // Helper for background color opacity
    const getBgColorClass = (value: number) => {
        if (value <= 50) return "bg-status-good/20";
        if (value <= 100) return "bg-status-moderate/20";
        if (value <= 150) return "bg-status-unhealthy/20";
        return "bg-status-danger/20";
    }

    return (
        <div className="min-h-screen bg-background-app text-text-primary flex justify-center pb-20">
            <div className="w-full max-w-4xl px-5 pt-10 md:pt-14 flex flex-col items-center">

                {/* Header */}
                <div className="w-full flex items-center justify-between mb-8 max-w-2xl">
                    <button
                        onClick={() => router.back()}
                        className="w-11 h-11 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors"
                    >
                        <IoArrowBack size={24} className="text-text-primary" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white">Alert Settings</h1>
                        <p className="text-xs text-text-secondary mt-1">Customize your notifications</p>
                    </div>
                    <div className="w-11" />
                </div>

                <div className="w-full max-w-2xl">
                    <div className="mb-8 rounded-2xl overflow-hidden bg-linear-to-br from-primary/30 to-accent/20 border border-white/5 p-5 flex items-center gap-4">
                        <IoSparkles size={24} className="text-accent shrink-0" />
                        <div>
                            <h3 className="font-bold text-text-primary mb-1">Smart Alerts</h3>
                            <p className="text-sm text-text-secondary leading-tight">Get notified when air quality reaches levels that matter to you</p>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-text-primary mb-2">Alert Sensitivity</h2>
                        <p className="text-sm text-text-secondary mb-4">Choose when you want to receive air quality notifications</p>

                        <div className="flex flex-col gap-3">
                            {alertPresets.map((preset) => (
                                <div
                                    key={preset.id}
                                    onClick={() => {
                                        setSelectedLevel(preset.id);
                                        if (preset.id !== "custom") setIsCustomExpanded(false);
                                    }}
                                    className={clsx(
                                        "relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer bg-card hover:border-white/10",
                                        selectedLevel === preset.id ? "border-primary" : "border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                            selectedLevel === preset.id ? `bg-white/10 ${preset.colorClass}` : "bg-text-secondary/10 text-text-secondary"
                                        )}>
                                            {preset.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">{preset.name}</p>
                                            <p className="text-xs text-text-secondary">{preset.description}</p>
                                        </div>
                                    </div>
                                    <div className={clsx(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        selectedLevel === preset.id ? "border-primary" : "border-text-secondary"
                                    )}>
                                        {selectedLevel === preset.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                </div>
                            ))}

                            {/* Custom Option */}
                            <div
                                onClick={handleCustomPress}
                                className={clsx(
                                    "relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer bg-card hover:border-white/10",
                                    selectedLevel === "custom" ? "border-primary" : "border-white/5",
                                    isCustomExpanded ? "rounded-b-none border-b-0" : ""
                                )}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                            selectedLevel === "custom" ? "bg-primary/20 text-primary" : "bg-text-secondary/10 text-text-secondary"
                                        )}>
                                            <IoOptions size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">Custom</p>
                                            <p className="text-xs text-text-secondary">
                                                {isCustomExpanded ? `Alert at AQI ${customThreshold}+` : "Set your own threshold"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                            selectedLevel === "custom" ? "border-primary" : "border-text-secondary"
                                        )}>
                                            {selectedLevel === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                        {isCustomExpanded ? <IoChevronUp className="text-text-secondary" /> : <IoChevronDown className="text-text-secondary" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Slider Area */}
                            {isCustomExpanded && (
                                <div className="bg-card border-x-2 border-b-2 border-primary rounded-b-2xl p-6 -mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* AQI Indicator */}
                                    <div className="bg-white/5 rounded-xl p-6 text-center mb-6">
                                        <p className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">Alert Threshold</p>
                                        <div className="flex items-baseline justify-center gap-3 mb-2">
                                            <span className={clsx("text-6xl font-black tracking-tighter", getThresholdColorClass(customThreshold))}>
                                                {customThreshold}
                                            </span>
                                            <div className="flex flex-col items-start">
                                                <span className="text-lg font-bold text-text-secondary">AQI</span>
                                                <div className={clsx("px-2 py-0.5 rounded text-xs font-bold", getBgColorClass(customThreshold), getThresholdColorClass(customThreshold))}>
                                                    {getThresholdLabel(customThreshold)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-secondary italic">
                                            {customThreshold <= 50 ? "Very sensitive - alerts for all changes" :
                                                customThreshold <= 100 ? "Moderate sensitivity - balanced alerting" :
                                                    customThreshold <= 150 ? "Low sensitivity - only unhealthy levels" :
                                                        "Minimal alerts - only dangerous levels"}
                                        </p>
                                    </div>

                                    {/* Slider */}
                                    <div className="mb-8 px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={customThreshold}
                                            onChange={(e) => setCustomThreshold(parseInt(e.target.value))}
                                            className="range range-xs w-full mb-2 [--range-shdw:none]"
                                            style={{
                                                // @ts-ignore custom var
                                                "--range-thumb-bgcolor": "#fff",
                                                color: customThreshold <= 50 ? "#22C55E" : customThreshold <= 100 ? "#EAB308" : customThreshold <= 150 ? "#F97316" : "#EF4444"
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-text-secondary font-medium px-1">
                                            <span>0</span>
                                            <span>50</span>
                                            <span>100</span>
                                            <span>150</span>
                                            <span>200</span>
                                        </div>
                                    </div>

                                    {/* Quick Presets */}
                                    <div>
                                        <p className="text-xs text-text-secondary font-bold mb-3 uppercase">Quick Adjust</p>
                                        <div className="flex gap-2">
                                            {[25, 50, 100, 150].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => setCustomThreshold(val)}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-lg text-sm font-bold border transition-colors",
                                                        customThreshold === val
                                                            ? `${getThresholdColorClass(val)} border-current bg-white/5`
                                                            : "border-white/10 text-text-secondary hover:border-white/30"
                                                    )}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-4">Notification Preferences</h2>
                        <div className="flex flex-col gap-3">
                            <div className="bg-card rounded-xl p-4 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-3">
                                    <IoPhonePortrait size={20} className="text-accent" />
                                    <span className="font-medium">Push Notifications</span>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" checked={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} />
                            </div>

                            <div className="bg-card rounded-xl p-4 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-3">
                                    <IoVolumeHigh size={20} className="text-accent" />
                                    <span className="font-medium">Voice Alerts</span>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" checked={voiceEnabled} onChange={() => setVoiceEnabled(!voiceEnabled)} />
                            </div>

                            <div className="bg-card rounded-xl p-4 flex items-center justify-between border border-white/5 opacity-70">
                                <div className="flex items-center gap-3">
                                    <IoTime size={20} className="text-accent" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">Quiet Hours</span>
                                        <span className="text-xs text-text-secondary">10 PM - 7 AM</span>
                                    </div>
                                </div>
                                <div className="badge badge-neutral">Enabled</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button (Fixed or Bottom) */}
                <div className="fixed bottom-0 left-0 right-0 p-5 bg-background-app border-t border-white/5 md:relative md:border-none md:bg-transparent md:w-full md:max-w-2xl md:p-0 md:mt-10 backdrop-blur-md md:backdrop-blur-none z-20">
                    <button
                        onClick={() => router.back()}
                        className="btn btn-block border-none bg-linear-to-r from-primary to-accent text-white text-lg font-bold rounded-2xl h-14 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                    >
                        Save Settings
                        <IoCheckmark size={24} />
                    </button>
                </div>

            </div>
        </div>
    );
}
