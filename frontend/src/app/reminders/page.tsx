"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReminders } from '@/hooks/useReminders';
import { Plus, Search, Filter, Bell, Calendar, User, Clock } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ReminderModal from '@/components/dashboard/modals/ReminderModal';

const RemindersPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { reminders, loading, error, createReminder, updateReminder, deleteReminder } = useReminders();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredReminders = reminders.filter(reminder => {
    const matchesFilter = filter === 'all' || reminder.status === filter;
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleCreateReminder = () => {
    setSelectedReminder(null);
    setModalMode('create');
    setShowReminderModal(true);
  };

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setModalMode('edit');
    setShowReminderModal(true);
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleSaveReminder = async (reminderData: any) => {
    try {
      if (modalMode === 'create') {
        await createReminder(reminderData);
      } else if (selectedReminder) {
        await updateReminder(selectedReminder._id, reminderData);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} />
        </div>
        
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <div className="lg:hidden">
              <Sidebar isOpen={isSidebarOpen} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Reminders</h1>
                <p className="text-muted-foreground">Manage your reminders and never miss important tasks</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search reminders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Reminders</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Add Reminder Button */}
                <button 
                  onClick={handleCreateReminder}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Reminder
                </button>
              </div>

              {/* Reminders List */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-2">Error loading reminders</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReminders.map((reminder) => (
                    <motion.div
                      key={reminder._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{reminder.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                              {reminder.status}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                              {reminder.priority} priority
                            </span>
                          </div>
                          
                          {reminder.description && (
                            <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(reminder.reminderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{reminder.reminderTime}</span>
                            </div>
                            <span className="px-2 py-1 bg-accent/50 rounded-full">
                              {reminder.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditReminder(reminder)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteReminder(reminder._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredReminders.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No reminders found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        reminder={selectedReminder}
        onSave={handleSaveReminder}
        onDelete={handleDeleteReminder}
        mode={modalMode}
      />
    </div>
  );
};

export default RemindersPage;
