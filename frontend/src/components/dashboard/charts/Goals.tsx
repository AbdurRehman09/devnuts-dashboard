"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Plus } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import GoalModal from '../modals/GoalModal';

const Goals = () => {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals({ limit: 6, status: 'active' });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setModalMode('create');
    setShowGoalModal(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setModalMode('edit');
    setShowGoalModal(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      console.log('Dashboard: Saving goal with data:', goalData);
      if (modalMode === 'create') {
        await createGoal(goalData);
        console.log('Dashboard: Goal created successfully');
      } else if (selectedGoal) {
        await updateGoal(selectedGoal._id, goalData);
        console.log('Dashboard: Goal updated successfully');
      }
      setShowGoalModal(false);
    } catch (error) {
      console.error('Dashboard: Error saving goal:', error);
    }
  };

  // Transform goals data for visualization
  const goalsData = goals.slice(0, 6).map((goal) => ({
    name: goal.title,
    value: goal.progress,
    color: goal.color,
    status: goal.status,
    priority: goal.priority,
    unit: goal.unit
  }));

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit min-h-[300px] flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit min-h-[300px] flex items-center justify-center"
      >
        <p className="text-red-500">Error loading goals</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit min-h-[300px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Your Goals</h3>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateGoal}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Goal
          </motion.button>
          <div className="text-xs text-muted-foreground">November 2024</div>
        </div>
      </div>

      {/* Circular Progress Chart */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Multiple circular progress rings */}
          {goalsData.map((item, index) => {
            const radius = 55 - index * 8; // Different radius for each ring
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (item.value / 100) * circumference;
            
            return (
              <svg
                key={index}
                className="absolute inset-0 w-full h-full transform -rotate-90"
                viewBox="0 0 120 120"
              >
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted opacity-20"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, delay: index * 0.2 + 1 }}
                />
              </svg>
            );
          })}
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {goalsData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 1.5 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{item.value}%</span>
              {item.name === 'Option 1' && (
                <TrendingUp className="w-3 h-3 text-green-500" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">This month progress</span>
          <span className="font-medium text-green-500">+12%</span>
        </div>
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
        mode={modalMode}
      />
    </motion.div>
  );
};

export default Goals;