"use client";

import React from 'react';
import { motion } from 'framer-motion';
import StatusCard from './StatusCard';

const StatusCardsContainer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-full"
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="h-24">
          <StatusCard type="completed" count={18} index={0} />
        </div>
        <div className="h-24">
          <StatusCard type="inprogress" count={6} index={1} />
        </div>
        <div className="h-24">
          <StatusCard type="closed" count={10} index={2} />
        </div>
        <div className="h-24">
          <StatusCard type="new" count={5} index={3} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCardsContainer;
