'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IoArrowBack,
  IoSparkles,
  IoShieldCheckmark,
  IoNotifications,
  IoAlertCircle,
  IoOptions,
  IoChevronDown,
  IoChevronUp,
  IoPhonePortrait,
  IoVolumeHigh,
  IoTime,
  IoCheckmark,
} from 'react-icons/io5';
import clsx from 'clsx';

type AlertLevel = 'auto' | 'high' | 'medium' | 'low' | 'custom';

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
    id: 'auto',
    name: 'Auto (Recommended)',
    description: 'Based on your health profile',
    icon: <IoSparkles size={24} />,
    colorClass: 'text-accent',
    colorHex: '#22D3EE',
  },
  {
    id: 'high',
    name: 'High Sensitivity',
    description: 'Alert at AQI 50+ (Good to Moderate)',
    icon: <IoShieldCheckmark size={24} />,
    aqiThreshold: 50,
    colorClass: 'text-status-good',
    colorHex: '#22C55E',
  },
  {
    id: 'medium',
    name: 'Medium Sensitivity',
    description: 'Alert at AQI 100+ (Moderate to Unhealthy)',
    icon: <IoNotifications size={24} />,
    aqiThreshold: 100,
    colorClass: 'text-status-moderate',
    colorHex: '#EAB308',
  },
  {
    id: 'low',
    name: 'Low Sensitivity',
    description: 'Alert at AQI 150+ (Unhealthy)',
    icon: <IoAlertCircle size={24} />,
    aqiThreshold: 150,
    colorClass: 'text-status-unhealthy',
    colorHex: '#F97316',
  },
];

export default function Alerts() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<AlertLevel>('auto');
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [customThreshold, setCustomThreshold] = useState(75);

  // Mock settings state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleCustomPress = () => {
    setSelectedLevel('custom');
    setIsCustomExpanded(!isCustomExpanded);
  };

  const getThresholdColorClass = (value: number) => {
    if (value <= 50) return 'text-status-good';
    if (value <= 100) return 'text-status-moderate';
    if (value <= 150) return 'text-status-unhealthy';
    return 'text-status-danger';
  };

  const getThresholdLabel = (value: number) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Unhealthy';
    return 'Dangerous';
  };

  // Helper for background color opacity
  const getBgColorClass = (value: number) => {
    if (value <= 50) return 'bg-status-good/20';
    if (value <= 100) return 'bg-status-moderate/20';
    if (value <= 150) return 'bg-status-unhealthy/20';
    return 'bg-status-danger/20';
  };

  return (
    <div className="bg-background-app text-text-primary flex min-h-screen justify-center pb-20">
      <div className="flex w-full max-w-4xl flex-col items-center px-5 pt-10 md:pt-14">
        {/* Header */}
        <div className="mb-8 flex w-full max-w-2xl items-center justify-between">
          <button
            onClick={() => router.back()}
            className="bg-card hover:bg-card/80 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
          >
            <IoArrowBack size={24} className="text-text-primary" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Alert Settings</h1>
            <p className="text-text-secondary mt-1 text-xs">Customize your notifications</p>
          </div>
          <div className="w-11" />
        </div>

        <div className="w-full max-w-2xl">
          <div className="from-primary/30 to-accent/20 mb-8 flex items-center gap-4 overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br p-5">
            <IoSparkles size={24} className="text-accent shrink-0" />
            <div>
              <h3 className="text-text-primary mb-1 font-bold">Smart Alerts</h3>
              <p className="text-text-secondary text-sm leading-tight">
                Get notified when air quality reaches levels that matter to you
              </p>
            </div>
          </div>

          {/* Presets */}
          <div className="mb-8">
            <h2 className="text-text-primary mb-2 text-xl font-bold">Alert Sensitivity</h2>
            <p className="text-text-secondary mb-4 text-sm">
              Choose when you want to receive air quality notifications
            </p>

            <div className="flex flex-col gap-3">
              {alertPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedLevel(preset.id);
                    if (preset.id !== 'custom') setIsCustomExpanded(false);
                  }}
                  className={clsx(
                    'bg-card relative flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 hover:border-white/10',
                    selectedLevel === preset.id ? 'border-primary' : 'border-white/5',
                  )}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={clsx(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                        selectedLevel === preset.id
                          ? `bg-white/10 ${preset.colorClass}`
                          : 'bg-text-secondary/10 text-text-secondary',
                      )}
                    >
                      {preset.icon}
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold">{preset.name}</p>
                      <p className="text-text-secondary text-xs">{preset.description}</p>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2',
                      selectedLevel === preset.id ? 'border-primary' : 'border-text-secondary',
                    )}
                  >
                    {selectedLevel === preset.id && (
                      <div className="bg-primary h-2.5 w-2.5 rounded-full" />
                    )}
                  </div>
                </div>
              ))}

              {/* Custom Option */}
              <div
                onClick={handleCustomPress}
                className={clsx(
                  'bg-card relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-all duration-200 hover:border-white/10',
                  selectedLevel === 'custom' ? 'border-primary' : 'border-white/5',
                  isCustomExpanded ? 'rounded-b-none border-b-0' : '',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={clsx(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                        selectedLevel === 'custom'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-text-secondary/10 text-text-secondary',
                      )}
                    >
                      <IoOptions size={24} />
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold">Custom</p>
                      <p className="text-text-secondary text-xs">
                        {isCustomExpanded
                          ? `Alert at AQI ${customThreshold}+`
                          : 'Set your own threshold'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2',
                        selectedLevel === 'custom' ? 'border-primary' : 'border-text-secondary',
                      )}
                    >
                      {selectedLevel === 'custom' && (
                        <div className="bg-primary h-2.5 w-2.5 rounded-full" />
                      )}
                    </div>
                    {isCustomExpanded ? (
                      <IoChevronUp className="text-text-secondary" />
                    ) : (
                      <IoChevronDown className="text-text-secondary" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Slider Area */}
              {isCustomExpanded && (
                <div className="bg-card border-primary animate-in fade-in slide-in-from-top-2 -mt-3 rounded-b-2xl border-x-2 border-b-2 p-6 duration-200">
                  {/* AQI Indicator */}
                  <div className="mb-6 rounded-xl bg-white/5 p-6 text-center">
                    <p className="text-text-secondary mb-2 text-xs font-bold tracking-widest uppercase">
                      Alert Threshold
                    </p>
                    <div className="mb-2 flex items-baseline justify-center gap-3">
                      <span
                        className={clsx(
                          'text-6xl font-black tracking-tighter',
                          getThresholdColorClass(customThreshold),
                        )}
                      >
                        {customThreshold}
                      </span>
                      <div className="flex flex-col items-start">
                        <span className="text-text-secondary text-lg font-bold">AQI</span>
                        <div
                          className={clsx(
                            'rounded px-2 py-0.5 text-xs font-bold',
                            getBgColorClass(customThreshold),
                            getThresholdColorClass(customThreshold),
                          )}
                        >
                          {getThresholdLabel(customThreshold)}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm italic">
                      {customThreshold <= 50
                        ? 'Very sensitive - alerts for all changes'
                        : customThreshold <= 100
                          ? 'Moderate sensitivity - balanced alerting'
                          : customThreshold <= 150
                            ? 'Low sensitivity - only unhealthy levels'
                            : 'Minimal alerts - only dangerous levels'}
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
                      className="range range-xs mb-2 w-full [--range-shdw:none]"
                      style={{
                        // @ts-ignore custom var
                        '--range-thumb-bgcolor': '#fff',
                        color:
                          customThreshold <= 50
                            ? '#22C55E'
                            : customThreshold <= 100
                              ? '#EAB308'
                              : customThreshold <= 150
                                ? '#F97316'
                                : '#EF4444',
                      }}
                    />
                    <div className="text-text-secondary flex justify-between px-1 text-xs font-medium">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <p className="text-text-secondary mb-3 text-xs font-bold uppercase">
                      Quick Adjust
                    </p>
                    <div className="flex gap-2">
                      {[25, 50, 100, 150].map((val) => (
                        <button
                          key={val}
                          onClick={() => setCustomThreshold(val)}
                          className={clsx(
                            'flex-1 rounded-lg border py-2 text-sm font-bold transition-colors',
                            customThreshold === val
                              ? `${getThresholdColorClass(val)} border-current bg-white/5`
                              : 'text-text-secondary border-white/10 hover:border-white/30',
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
            <h2 className="text-text-primary mb-4 text-xl font-bold">Notification Preferences</h2>
            <div className="flex flex-col gap-3">
              <div className="bg-card flex items-center justify-between rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-3">
                  <IoPhonePortrait size={20} className="text-accent" />
                  <span className="font-medium">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={pushEnabled}
                  onChange={() => setPushEnabled(!pushEnabled)}
                />
              </div>

              <div className="bg-card flex items-center justify-between rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-3">
                  <IoVolumeHigh size={20} className="text-accent" />
                  <span className="font-medium">Voice Alerts</span>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={voiceEnabled}
                  onChange={() => setVoiceEnabled(!voiceEnabled)}
                />
              </div>

              <div className="bg-card flex items-center justify-between rounded-xl border border-white/5 p-4 opacity-70">
                <div className="flex items-center gap-3">
                  <IoTime size={20} className="text-accent" />
                  <div className="flex flex-col">
                    <span className="font-medium">Quiet Hours</span>
                    <span className="text-text-secondary text-xs">10 PM - 7 AM</span>
                  </div>
                </div>
                <div className="badge badge-neutral">Enabled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button (Fixed or Bottom) */}
        <div className="bg-background-app fixed right-0 bottom-0 left-0 z-20 border-t border-white/5 p-5 backdrop-blur-md md:relative md:mt-10 md:w-full md:max-w-2xl md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <button
            onClick={() => router.back()}
            className="btn btn-block from-primary to-accent shadow-primary/30 h-14 rounded-2xl border-none bg-linear-to-r text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            Save Settings
            <IoCheckmark size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
