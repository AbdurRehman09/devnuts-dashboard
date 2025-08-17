"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';

interface Reminder {
  id: number;
  name: string;
  date: string;
  status: 'pending' | 'done';
  time?: string;
}

const reminders: Reminder[] = [
  {
    id: 1,
    name: 'Car wash book for marketing',
    date: '10-Sep-24 - 3:00am',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Complete list task of UI',
    date: '10-Sep-24 - 3:00am',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Meetup with clients',
    date: '10-Sep-24 - 3:00am',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Meetup with clients',
    date: '10-Sep-24 - 3:00am',
    status: 'pending'
  }
];

const Reminders = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Reminders</h3>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            + Reminder
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary text-sm font-medium hover:underline"
          >
            View all
          </motion.button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">
        <div className="col-span-5">Name</div>
        <div className="col-span-4">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Action</div>
      </div>

      {/* Reminders List */}
      <div className="space-y-2">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 1.4 }}
            className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
          >
            {/* Name */}
            <div className="col-span-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">
                  {reminder.name}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="col-span-4">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {reminder.date}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${reminder.status === 'done' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }
              `}>
                {reminder.status === 'done' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Done
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
              </span>
            </div>

            {/* Action */}
            <div className="col-span-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded hover:bg-accent transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Extra spacing to match calendar height */}
      <div className="h-16"></div>
    </motion.div>
  );
};

export default Reminders;
