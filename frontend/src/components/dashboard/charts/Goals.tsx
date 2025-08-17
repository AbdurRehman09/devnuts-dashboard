"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

const goalsData = [
  { name: 'Option 1', value: 60, color: '#10b981' },
  { name: 'Option 2', value: 25, color: '#f59e0b' },
  { name: 'Option 3', value: 15, color: '#6366f1' }
];

const Goals = () => {
  const totalGoals = goalsData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit min-h-[300px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Your Goals</h3>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            + Goal
          </motion.button>
          <div className="text-xs text-muted-foreground">November 2024</div>
        </div>
      </div>

      {/* Circular Progress Chart */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Multiple circular progress rings */}
          {goalsData.map((item, index) => {
            const radius = 55 - index * 8; // Different radius for each ring
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (item.value / 100) * circumference;
            
            return (
              <svg
                key={index}
                className="absolute inset-0 w-full h-full transform -rotate-90"
                viewBox="0 0 120 120"
              >
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted opacity-20"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, delay: index * 0.2 + 1 }}
                />
              </svg>
            );
          })}
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {goalsData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 1.5 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{item.value}%</span>
              {item.name === 'Option 1' && (
                <TrendingUp className="w-3 h-3 text-green-500" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">This month progress</span>
          <span className="font-medium text-green-500">+12%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Goals;