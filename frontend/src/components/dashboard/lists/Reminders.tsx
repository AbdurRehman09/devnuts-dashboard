"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, CheckCircle, MoreHorizontal, Plus } from 'lucide-react';
import { useUpcomingReminders } from '@/hooks/useReminders';
import { Reminder } from '@/services/reminderService';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'pending':
      return Clock;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-500';
    case 'pending':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

const Reminders = () => {
  const { reminders, loading, error } = useUpcomingReminders();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-fit"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-fit"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading reminders: {error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Reminders</h3>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Reminder
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary text-sm font-medium hover:underline"
          >
            View All
          </motion.button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 pb-3">
        <div className="col-span-4">Name</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Action</div>
        <div className="col-span-1"></div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.slice(0, 4).map((reminder: Reminder, index: number) => {
          const StatusIcon = getStatusIcon(reminder.status);
          const reminderDate = new Date(reminder.reminderDate);
          const isToday = reminderDate.toDateString() === new Date().toDateString();
          
          return (
            <motion.div
              key={reminder._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 1.2 }}
              className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-accent/50 rounded-lg px-2 transition-colors"
            >
              {/* Name */}
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${getStatusColor(reminder.status)}`} />
                  <div>
                    <div className="font-medium text-foreground text-sm">{reminder.title}</div>
                    <div className="text-xs text-muted-foreground">{reminder.category}</div>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-3">
                <div className="text-sm text-foreground">
                  {reminderDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} at {reminder.reminderTime}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${reminder.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    reminder.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}
                `}>
                  {reminder.status}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <button className="text-xs text-primary hover:underline">
                    Edit
                  </button>
                  <button className="text-xs text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>

              {/* More */}
              <div className="col-span-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-lg hover:bg-accent transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming reminders</p>
            <p className="text-sm">Create your first reminder to get started</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Reminder
          </button>
        </div>
      )}

      {/* Summary */}
      {reminders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {reminders.filter(r => r.status === 'pending').length} pending • {reminders.length} total
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Extra spacing to align with CalendarMeetings */}
      <div className="h-16"></div>
    </motion.div>
  );
};

export default Reminders;