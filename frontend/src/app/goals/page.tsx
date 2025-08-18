"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGoals } from '@/hooks/useGoals';
import { Plus, Search, Filter, Target, TrendingUp, Calendar, User } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import GoalModal from '@/components/dashboard/modals/GoalModal';

const GoalsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || goal.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

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
      if (modalMode === 'create') {
        await createGoal(goalData);
      } else if (selectedGoal) {
        await updateGoal(selectedGoal._id, goalData);
      }
      setShowGoalModal(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <Header
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-3 md:p-6">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Goals</h1>
                  <p className="text-muted-foreground">Track and manage your personal and professional goals</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Goals</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Add Goal Button */}
              <button
                onClick={handleCreateGoal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>

              {/* Goals Grid */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              )}

              {filteredGoals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGoals.map((goal, index) => {
                    const progressPercentage = goal.targetValue > 0 ? 
                      Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0;

                    return (
                      <motion.div
                        key={goal._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow ${getPriorityColor(goal.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                          </div>
                          <Target className="w-5 h-5 text-primary" />
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-accent rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{goal.currentValue} {goal.unit}</span>
                            <span className="text-xs text-muted-foreground">{goal.targetValue} {goal.unit}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                              {goal.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {goal.category}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                            </div>
                            {goal.startDate && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Started: {new Date(goal.startDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <button
                              onClick={() => handleEditGoal(goal)}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteGoal(goal._id)}
                              className="text-sm text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {filteredGoals.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No goals found</p>
                  <p className="text-sm text-muted-foreground">Create your first goal to get started</p>
                </div>
              )}
            </div>
          </main>
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
    </div>
  );
};

export default GoalsPage;
