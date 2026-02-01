"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";
import { IoClose, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card w-full max-w-sm overflow-hidden rounded-2xl shadow-xl z-50 border border-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h2 className="text-text-primary text-xl font-bold">Settings</h2>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close Settings"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme Toggle */}
              <div>
                <h3 className="text-text-primary mb-3 font-semibold">
                  Appearance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                      theme === "light"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-white/5 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <IoSunnyOutline size={24} />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                      theme === "dark"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-white/5 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <IoMoonOutline size={24} />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>

              {/* Placeholders for future settings */}
              <div>
                <h3 className="text-text-primary mb-3 font-semibold">
                  Preferences
                </h3>
                <div className="text-text-secondary text-sm italic">
                  More settings coming soon...
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
              <p className="text-center text-xs text-text-secondary">
                Tempestas v0.1.0-alpha
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
