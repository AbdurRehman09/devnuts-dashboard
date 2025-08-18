"use client";

import React from 'react';
import { motion } from 'framer-motion';
import StatusCard from './StatusCard';
import { useTaskStats } from '@/hooks/useTasks';

const StatusCardsContainer = () => {
  const { stats, loading, error } = useTaskStats();

  // Get counts from API data or use defaults
  const getStatusCount = (status: string) => {
    if (!stats?.statusBreakdown) return 0;
    const statusData = stats.statusBreakdown.find(item => item._id === status);
    return statusData?.count || 0;
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-full flex items-center justify-center"
      >
        <p className="text-red-500">Error loading task statistics</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-full"
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="h-24">
          <StatusCard 
            type="completed" 
            count={loading ? 0 : getStatusCount('completed')} 
            index={0}
            loading={loading}
          />
        </div>
        <div className="h-24">
          <StatusCard 
            type="inprogress" 
            count={loading ? 0 : getStatusCount('inprogress')} 
            index={1}
            loading={loading}
          />
        </div>
        <div className="h-24">
          <StatusCard 
            type="closed" 
            count={loading ? 0 : getStatusCount('closed')} 
            index={2}
            loading={loading}
          />
        </div>
        <div className="h-24">
          <StatusCard 
            type="new" 
            count={loading ? 0 : getStatusCount('new')} 
            index={3}
            loading={loading}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCardsContainer;
