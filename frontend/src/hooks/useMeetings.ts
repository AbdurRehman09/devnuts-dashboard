import { useState, useEffect } from 'react';
import { meetingService, Meeting } from '@/services/meetingService';

export const useMeetings = (params?: {
  status?: string;
  date?: string;
  organizer?: string;
  page?: number;
  limit?: number;
}) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await meetingService.getMeetings(params);
      setMeetings(data.meetings);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [JSON.stringify(params)]);

  const createMeeting = async (meetingData: any) => {
    try {
      const newMeeting = await meetingService.createMeeting(meetingData);
      setMeetings(prev => [newMeeting, ...prev]);
      return newMeeting;
    } catch (err) {
      throw err;
    }
  };

  const updateMeeting = async (id: string, meetingData: any) => {
    try {
      const updatedMeeting = await meetingService.updateMeeting(id, meetingData);
      setMeetings(prev => prev.map(meeting => meeting._id === id ? updatedMeeting : meeting));
      return updatedMeeting;
    } catch (err) {
      throw err;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await meetingService.deleteMeeting(id);
      setMeetings(prev => prev.filter(meeting => meeting._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    meetings,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
  };
};

export const useTodayMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await meetingService.getTodayMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch today\'s meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayMeetings();
  }, []);

  const createMeeting = async (meetingData: any) => {
    try {
      const newMeeting = await meetingService.createMeeting(meetingData);
      setMeetings(prev => [newMeeting, ...prev]);
      return newMeeting;
    } catch (err) {
      throw err;
    }
  };

  const updateMeeting = async (id: string, meetingData: any) => {
    try {
      const updatedMeeting = await meetingService.updateMeeting(id, meetingData);
      setMeetings(prev => prev.map(meeting => meeting._id === id ? updatedMeeting : meeting));
      return updatedMeeting;
    } catch (err) {
      throw err;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await meetingService.deleteMeeting(id);
      setMeetings(prev => prev.filter(meeting => meeting._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { 
    meetings, 
    loading, 
    error, 
    refetch: fetchTodayMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
  };
};
