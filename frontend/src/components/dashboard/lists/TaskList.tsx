"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Users, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/services/taskService';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'inprogress':
      return 'bg-orange-500';
    case 'closed':
      return 'bg-blue-500';
    case 'new':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Complete';
    case 'inprogress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'new': return 'New';
    default: return status;
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const TaskList = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks({ limit: 10 });
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg"
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
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-lg"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading tasks: {error}</p>
        </div>
      </motion.div>
    );
  }

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
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Task
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
        {tasks.map((task: Task, index: number) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
            className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-accent/50 rounded-lg px-2 transition-colors"
          >
            {/* Task Name */}
            <div className="col-span-4">
              <div className="font-medium text-foreground mb-1">{task.title}</div>
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
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {getInitials(task.assignedBy)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{task.assignedBy}</div>
                  <div className="text-xs text-muted-foreground">To: {task.assignedTo}</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  task.status === 'inprogress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                  task.status === 'closed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'}
              `}>
                {getStatusLabel(task.status)}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: '2-digit'
                }) : 'No due date'}
              </div>
            </div>

            {/* Action */}
            <div className="col-span-1">
              <div className="flex items-center gap-1">
                <button className="text-xs text-blue-500 hover:underline">
                  Edit
                </button>
                <span className="text-xs text-muted-foreground">|</span>
                <button className="text-xs text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tasks found</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Task
          </button>
        </div>
      )}

      {/* Additional stats row */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {tasks.length} tasks</span>
          <span>•</span>
          <span>Avg Progress: {Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / (tasks.length || 1))}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">On Track</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskList;