"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, PlusCircle } from 'lucide-react';

interface StatusCardProps {
  type: 'completed' | 'inprogress' | 'closed' | 'new';
  count: number;
  index: number;
  loading?: boolean;
}

const cardConfig = {
  completed: {
    title: 'Completed Task',
    icon: CheckCircle2,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    bgGradient: 'from-green-400 to-green-600'
  },
  inprogress: {
    title: 'In Progress Task',
    icon: Clock,
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    bgGradient: 'from-orange-400 to-orange-600'
  },
  closed: {
    title: 'Closed Task',
    icon: XCircle,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    bgGradient: 'from-blue-400 to-blue-600'
  },
  new: {
    title: 'New Task',
    icon: PlusCircle,
    bgColor: 'bg-pink-500',
    textColor: 'text-white',
    bgGradient: 'from-pink-400 to-pink-600'
  }
};

const StatusCard = ({ type, count, index, loading = false }: StatusCardProps) => {
  const config = cardConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`
        relative overflow-hidden rounded-lg p-4 text-white cursor-pointer h-full
        bg-gradient-to-br ${config.bgGradient}
        shadow-md hover:shadow-lg transition-all duration-300
        flex flex-col justify-between
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/20" />
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-white/20 rounded-lg">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="text-right">
            <motion.h3 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="text-2xl font-bold"
            >
              {count}
            </motion.h3>
          </div>
        </div>
        <div>
          <h4 className="text-base font-semibold opacity-90">{config.title}</h4>
          <p className="text-xs opacity-75">Track your progress</p>
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-white/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StatusCard;
