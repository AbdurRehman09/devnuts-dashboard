"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

const analyticsData = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 50 },
  { month: 'May', value: 45 },
  { month: 'Jun', value: 60 },
  { month: 'Jul', value: 75 },
  { month: 'Aug', value: 65 },
  { month: 'Sep', value: 80 },
  { month: 'Oct', value: 85 },
  { month: 'Nov', value: 90 },
  { month: 'Dec', value: 95 },
];

const TaskAnalytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl p-6 border border-border shadow-lg h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Task Analytics</h3>
          <p className="text-sm text-muted-foreground">Performance overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">+15%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={analyticsData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorGradient)"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">85%</div>
          <div className="text-xs text-muted-foreground">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">24</div>
          <div className="text-xs text-muted-foreground">Tasks This Month</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">95</div>
          <div className="text-xs text-muted-foreground">Total Tasks</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskAnalytics;
