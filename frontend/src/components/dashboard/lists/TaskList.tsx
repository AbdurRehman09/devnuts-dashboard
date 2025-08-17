"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Users } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  assignedBy: string;
  status: 'in-progress' | 'complete' | 'closed';
  progress: number;
  date: string;
  avatar: string;
}

const tasks: Task[] = [
  {
    id: 1,
    name: 'Prep proposal',
    assignedBy: 'Jaspal Sharma',
    status: 'in-progress',
    progress: 75,
    date: '11 Sep, 24',
    avatar: 'JS'
  },
  {
    id: 2,
    name: 'Black Marketing',
    assignedBy: 'Charchanshu',
    status: 'complete',
    progress: 100,
    date: '11 Sep, 24',
    avatar: 'CH'
  },
  {
    id: 3,
    name: 'Black Marketing',
    assignedBy: 'Charchanshu',
    status: 'closed',
    progress: 50,
    date: '11 Sep, 24',
    avatar: 'CH'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-orange-500';
    case 'closed':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

const TaskList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Task List</h3>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            + Task
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
        <div className="col-span-4">Task name</div>
        <div className="col-span-3">Assign by</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Action</div>
      </div>

      {/* Task Items */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
            className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-accent/50 rounded-lg px-2 transition-colors"
          >
            {/* Task Name */}
            <div className="col-span-4">
              <div className="font-medium text-foreground mb-1">{task.name}</div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 1 }}
                  className={`h-2 rounded-full ${getStatusColor(task.status)}`}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{task.progress}%</div>
            </div>

            {/* Assigned By */}
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {task.avatar}
                </div>
                <span className="text-sm text-foreground">{task.assignedBy}</span>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-2">
              <span className="text-sm text-muted-foreground">{task.date}</span>
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
    </motion.div>
  );
};

export default TaskList;
