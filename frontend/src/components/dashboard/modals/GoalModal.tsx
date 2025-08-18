"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Target } from 'lucide-react';
import { Goal } from '@/services/goalService';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal | null;
  onSave: (goalData: any) => void;
  onDelete?: (goalId: string) => void;
  mode: 'create' | 'edit';
}

const GoalModal = ({ isOpen, onClose, goal, onSave, onDelete, mode }: GoalModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    targetValue: 100,
    currentValue: 0,
    unit: 'percent',
    startDate: '',
    targetDate: '',
    priority: 'medium',
    status: 'active',
    color: '#3b82f6',
    isPublic: false,
    notes: ''
  });

  useEffect(() => {
    if (goal && mode === 'edit') {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        category: goal.category || 'personal',
        targetValue: goal.targetValue || 100,
        currentValue: goal.currentValue || 0,
        unit: goal.unit || 'percent',
        startDate: goal.startDate ? goal.startDate.split('T')[0] : '',
        targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
        priority: goal.priority || 'medium',
        status: goal.status || 'active',
        color: goal.color || '#3b82f6',
        isPublic: (goal as any).isPublic || false,
        notes: (goal as any).notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        targetValue: 100,
        currentValue: 0,
        unit: 'percent',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        priority: 'medium',
        status: 'active',
        color: '#3b82f6',
        isPublic: false,
        notes: ''
      });
    }
  }, [goal, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format data before sending
    const submitData = {
      ...formData,
      targetValue: Number(formData.targetValue),
      currentValue: Number(formData.currentValue),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      // Convert empty strings to undefined for optional fields
      notes: formData.notes.trim() || undefined
    };
    
    onSave(submitData);
    onClose();
  };

  const handleDelete = () => {
    if (goal && onDelete && confirm('Are you sure you want to delete this goal?')) {
      onDelete(goal._id);
      onClose();
    }
  };

  const getProgressPercentage = () => {
    if (formData.targetValue === 0) return 0;
    return Math.min((formData.currentValue / formData.targetValue) * 100, 100);
  };

  const predefinedColors = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#f97316', // Orange
    '#6366f1'  // Indigo
  ];

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
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: formData.color + '20', color: formData.color }}
            >
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {mode === 'create' ? 'Create New Goal' : 'Edit Goal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Preview */}
        {mode === 'edit' && (
          <div className="mb-6 p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Current Progress</span>
              <span className="text-sm text-muted-foreground">
                {getProgressPercentage().toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: formData.color 
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{formData.currentValue} {formData.unit}</span>
              <span>{formData.targetValue} {formData.unit}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Read 12 books this year"
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
              placeholder="Describe your goal and why it's important to you..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="personal">Personal</option>
                <option value="professional">Professional</option>
                <option value="health">Health & Fitness</option>
                <option value="financial">Financial</option>
                <option value="education">Education</option>
                <option value="relationships">Relationships</option>
                <option value="creative">Creative</option>
                <option value="other">Other</option>
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

          {/* Target & Current Values */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Value *
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Value
              </label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: parseInt(e.target.value) || 0 })}
                min="0"
                max={formData.targetValue}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percent">Percent (%)</option>
                <option value="count">Count</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="pages">Pages</option>
                <option value="kg">Kilograms</option>
                <option value="km">Kilometers</option>
                <option value="dollars">Dollars ($)</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Goal Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Custom:</span>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-8 h-8 rounded border border-border"
                />
              </div>
            </div>
          </div>

          {/* Public/Private */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
              Make this goal public (visible to team members)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any additional notes, strategies, or reminders..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
                Delete Goal
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
                {mode === 'create' ? 'Create Goal' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GoalModal;
