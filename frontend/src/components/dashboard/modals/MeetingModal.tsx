"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, UserPlus } from 'lucide-react';
import { Meeting } from '@/services/meetingService';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: Meeting | null;
  onSave: (meetingData: any) => void;
  onDelete?: (meetingId: string) => void;
  mode: 'create' | 'edit';
}

const MeetingModal = ({ isOpen, onClose, meeting, onSave, onDelete, mode }: MeetingModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    date: '',
    location: '',
    meetingType: 'in-person',
    priority: 'medium',
    status: 'scheduled',
    participants: [''],
    agenda: [''],
    notes: ''
  });

  useEffect(() => {
    if (meeting && mode === 'edit') {
      // Use meetingDate field for date, fallback to current date
      const meetingDate = meeting.meetingDate ? new Date(meeting.meetingDate) : new Date();
      
      // Validate date
      const validDate = isNaN(meetingDate.getTime()) ? new Date() : meetingDate;

      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        startTime: meeting.startTime || '09:00',
        endTime: meeting.endTime || '10:00',
        date: validDate.toISOString().split('T')[0],
        location: meeting.location || '',
        meetingType: meeting.meetingType || 'in-person',
        priority: meeting.priority || 'medium',
        status: meeting.status || 'scheduled',
        participants: meeting.participants && meeting.participants.length > 0 ? 
          meeting.participants.map(p => typeof p === 'string' ? p : p.name || p.email) : [''],
        agenda: meeting.agenda ? [meeting.agenda] : [''],
        notes: meeting.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        date: new Date().toISOString().split('T')[0],
        location: '',
        meetingType: 'in-person',
        priority: 'medium',
        status: 'scheduled',
        participants: [''],
        agenda: [''],
        notes: ''
      });
    }
  }, [meeting, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time for startTime and endTime
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    
    // Calculate duration in minutes
    const durationInMs = endDateTime.getTime() - startDateTime.getTime();
    const durationInMinutes = Math.max(Math.round(durationInMs / (1000 * 60)), 15); // Minimum 15 minutes
    
    // Filter out empty participants and agenda items
    const filteredParticipants = formData.participants.filter(p => p.trim() !== '');
    const filteredAgenda = formData.agenda.filter(a => a.trim() !== '');
    
    const submitData = {
      ...formData,
      meetingDate: startDateTime.toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: durationInMinutes, // Add calculated duration
      organizer: 'Current User', // Add default organizer
      participants: filteredParticipants, // Simple string array
      agenda: filteredAgenda.join('\n') // Convert array to string
    };
    
    onSave(submitData);
    onClose();
  };

  const handleDelete = () => {
    if (meeting && onDelete && confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting._id);
      onClose();
    }
  };

  const addParticipant = () => {
    setFormData({ ...formData, participants: [...formData.participants, ''] });
  };

  const removeParticipant = (index: number) => {
    const newParticipants = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: newParticipants });
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData({ ...formData, participants: newParticipants });
  };

  const addAgenda = () => {
    setFormData({ ...formData, agenda: [...formData.agenda, ''] });
  };

  const removeAgenda = (index: number) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: newAgenda });
  };

  const updateAgenda = (index: number, value: string) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData({ ...formData, agenda: newAgenda });
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
        className="bg-card rounded-lg p-6 w-full max-w-3xl border border-border max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Schedule New Meeting' : 'Edit Meeting'}
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
              Meeting Title *
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Location & Meeting Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location/Link
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Office room or meeting link"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Meeting Type
              </label>
              <select
                value={formData.meetingType}
                onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="in-person">In-Person</option>
                <option value="video-call">Video Call</option>
                <option value="phone-call">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Participants
              </label>
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                <UserPlus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder="Enter participant name or email"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Agenda Items
              </label>
              <button
                type="button"
                onClick={addAgenda}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                <UserPlus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateAgenda(index, e.target.value)}
                    placeholder="Enter agenda item"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgenda(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              placeholder="Any additional notes..."
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
                Delete Meeting
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
                {mode === 'create' ? 'Schedule Meeting' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MeetingModal;
