"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2 } from 'lucide-react';
import { Reminder } from '@/services/reminderService';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder?: Reminder | null;
  onSave: (reminderData: any) => void;
  onDelete?: (reminderId: string) => void;
  mode: 'create' | 'edit';
}

const ReminderModal = ({ isOpen, onClose, reminder, onSave, onDelete, mode }: ReminderModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderDate: '',
    reminderTime: '09:00',
    status: 'pending',
    priority: 'medium',
    category: 'work',
    isRecurring: false,
    recurringType: 'daily'
  });

  useEffect(() => {
    if (reminder && mode === 'edit') {
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        reminderDate: reminder.reminderDate ? reminder.reminderDate.split('T')[0] : '',
        reminderTime: reminder.reminderTime || '09:00',
        status: reminder.status || 'pending',
        priority: reminder.priority || 'medium',
        category: reminder.category || 'work',
        isRecurring: reminder.isRecurring || false,
        recurringType: reminder.recurringType || 'daily'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        reminderDate: '',
        reminderTime: '09:00',
        status: 'pending',
        priority: 'medium',
        category: 'work',
        isRecurring: false,
        recurringType: 'daily'
      });
    }
  }, [reminder, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format data before sending
    const submitData = {
      ...formData,
      reminderDate: formData.reminderDate ? new Date(formData.reminderDate).toISOString() : new Date().toISOString(),
      // Convert empty strings to undefined for optional fields  
      description: formData.description.trim() || undefined
    };
    
    onSave(submitData);
    onClose();
  };

  const handleDelete = () => {
    if (reminder && onDelete && confirm('Are you sure you want to delete this reminder?')) {
      onDelete(reminder._id);
      onClose();
    }
  };

  if (!isOpen) return null;

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
        className="bg-card rounded-lg p-6 w-full max-w-2xl border border-border max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Create New Reminder' : 'Edit Reminder'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reminder Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.reminderDate}
                onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-foreground">
                Recurring Reminder
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recurring Type
                </label>
                <select
                  value={formData.recurringType}
                  onChange={(e) => setFormData({ ...formData, recurringType: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Reminder
              </button>
            )}
            
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                {mode === 'create' ? 'Create Reminder' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReminderModal;
