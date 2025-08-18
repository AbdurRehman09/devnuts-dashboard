"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMeetings } from '@/hooks/useMeetings';
import { Plus, Search, Calendar as CalendarIcon, Clock, Users, Video } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MeetingModal from '@/components/dashboard/modals/MeetingModal';

const CalendarPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { meetings, loading, error, createMeeting, updateMeeting, deleteMeeting } = useMeetings();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video-call': return Video;
      case 'phone-call': return Clock;
      default: return Users;
    }
  };

  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setModalMode('create');
    setShowMeetingModal(true);
  };

  const handleEditMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setModalMode('edit');
    setShowMeetingModal(true);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await deleteMeeting(meetingId);
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleSaveMeeting = async (meetingData: any) => {
    try {
      if (modalMode === 'create') {
        await createMeeting(meetingData);
      } else if (selectedMeeting) {
        await updateMeeting(selectedMeeting._id, meetingData);
      }
      setShowMeetingModal(false);
    } catch (error) {
      console.error('Error saving meeting:', error);
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Calendar & Meetings</h1>
                <p className="text-muted-foreground">Schedule and manage your meetings</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Add Meeting Button */}
                <button 
                  onClick={handleCreateMeeting}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Meeting
                </button>
              </div>

              {/* Meetings List */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-2">Error loading meetings</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMeetings.map((meeting) => {
                    const TypeIcon = getMeetingTypeIcon(meeting.meetingType);
                    
                    return (
                      <motion.div
                        key={meeting._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{meeting.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>
                          </div>
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                              {meeting.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {meeting.duration} min
                            </span>
                          </div>

                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{new Date(meeting.meetingDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{meeting.startTime} - {meeting.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>Organizer: {meeting.organizer}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button className="text-xs text-green-500 hover:underline">
                              Join
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(meeting._id)}
                              className="text-xs text-red-500 hover:underline"
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

              {filteredMeetings.length === 0 && !loading && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No meetings scheduled</p>
                  <p className="text-sm text-muted-foreground">Schedule your first meeting to get started</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        meeting={selectedMeeting}
        onSave={handleSaveMeeting}
        onDelete={handleDeleteMeeting}
        mode={modalMode}
      />
    </div>
  );
};

export default CalendarPage;
