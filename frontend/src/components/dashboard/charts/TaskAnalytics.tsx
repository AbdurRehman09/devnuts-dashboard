"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/useAnalytics';

const TaskAnalytics = () => {
  const { analytics, loading, error } = useDashboardAnalytics();

  // Transform API data for chart
  const transformAnalyticsData = () => {
    if (!analytics?.taskAnalytics) return [];
    
    return analytics.taskAnalytics.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: item.completed,
      inProgress: item.inProgress,
      new: item.new,
      closed: item.closed,
      total: item.completed + item.inProgress + item.new + item.closed
    }));
  };

  const chartData = transformAnalyticsData();
  const totalTasks = analytics?.taskStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;

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
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {loading ? '...' : '+15%'}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '180px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error loading analytics data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
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
                dataKey="date" 
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
                dataKey="total"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorGradient)"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {loading ? '...' : '85%'}
          </div>
          <div className="text-xs text-muted-foreground">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {loading ? '...' : chartData.length}
          </div>
          <div className="text-xs text-muted-foreground">Days Tracked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {loading ? '...' : totalTasks}
          </div>
          <div className="text-xs text-muted-foreground">Total Tasks</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskAnalytics;