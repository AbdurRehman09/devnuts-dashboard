"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Trash2, Eye, Copy } from 'lucide-react';

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: any) => void;
}

const TaskActionModal = ({ isOpen, onClose, task, onEdit, onDelete, onDuplicate }: TaskActionModalProps) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    onDuplicate(task);
    onClose();
  };

  const handleViewDetails = () => {
    // Open task details modal or navigate to task details page
    console.log('View task details:', task);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg p-6 w-full max-w-md border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Task Actions</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Info */}
        <div className="mb-6 p-3 bg-accent/50 rounded-lg">
          <h4 className="font-medium text-foreground">{task?.title}</h4>
          <p className="text-sm text-muted-foreground">{task?.status} • {task?.priority} priority</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>View Details</span>
          </button>

          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-green-500" />
            <span>Edit Task</span>
          </button>

          <button
            onClick={handleDuplicate}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-orange-500" />
            <span>Duplicate Task</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent rounded-lg transition-colors text-red-500"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskActionModal;
