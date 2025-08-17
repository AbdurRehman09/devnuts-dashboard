"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusCardsContainer from './cards/StatusCardsContainer';
import TaskAnalytics from './charts/TaskAnalytics';
import TaskList from './lists/TaskList';
import Goals from './charts/Goals';
import CalendarMeetings from './CalendarMeetings';
import Reminders from './lists/Reminders';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar - Always visible on desktop */}
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
          
          {/* Dashboard Content */}
          <main className="flex-1 p-3 md:p-6">
            <div className="space-y-4 md:space-y-8">
              
              {/* Row 1: Status Cards Container + Task Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Status Cards Container - 50% width */}
                <div className="h-68">
                  <StatusCardsContainer />
                </div>
                
                {/* Task Analytics - 50% width */}
                <div className="h-68">
                  <TaskAnalytics />
                </div>
              </div>

              {/* Row 2: Task List + Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Task List */}
                <div className="lg:col-span-2">
                  <TaskList />
                </div>
                
                {/* Goals */}
                <div className="lg:col-span-1">
                  <Goals />
                </div>
              </div>

              {/* Row 3: Reminders + Calendar & Meetings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Reminders - Full width like Task List */}
                <div className="lg:col-span-2">
                  <Reminders />
                </div>
                
                {/* Calendar & Meetings Combined */}
                <div className="lg:col-span-1">
                  <CalendarMeetings />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;