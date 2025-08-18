"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Plus } from 'lucide-react';
import { useTodayMeetings } from '@/hooks/useMeetings';

const CalendarMeetings = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meetings, loading, error } = useTodayMeetings();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="bg-card rounded-xl p-4 border border-border shadow-lg h-fit"
    >
      {/* Calendar Section */}
      <div className="mb-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('prev')}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-foreground" />
            </motion.button>
            <span className="text-xs font-medium text-foreground min-w-[80px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('next')}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 + 1.2 }}
              className={`
                h-6 flex items-center justify-center text-xs rounded cursor-pointer
                transition-all duration-200 hover:bg-accent
                ${day === null ? 'invisible' : ''}
                ${isToday(day || 0) 
                  ? 'bg-primary text-primary-foreground font-bold' 
                  : 'text-foreground hover:text-foreground'
                }
                ${day === 18 && !isToday(day || 0) 
                  ? 'bg-accent text-foreground' 
                  : ''
                }
              `}
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Today's Info */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Today</span>
            <span className="font-medium text-foreground">
              {today.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Today Meetings Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Today Meetings</h4>
          <span className="text-xs text-primary cursor-pointer">+ Meeting</span>
        </div>

        {/* Simple Meetings List */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-xs text-red-500">Error loading meetings</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">No meetings scheduled</p>
            </div>
          ) : (
            meetings.slice(0, 3).map((meeting, index) => (
              <div key={meeting._id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs text-foreground">{meeting.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {meeting.project?.name || meeting.meetingType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground">
                    {meeting.startTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {parseInt(meeting.startTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Extra spacing to align with Reminders */}
      <div className="h-4"></div>
    </motion.div>
  );
};

export default CalendarMeetings;
