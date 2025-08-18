import { useState, useEffect } from 'react';
import { reminderService, Reminder } from '@/services/reminderService';

export const useReminders = (params?: {
  status?: string;
  category?: string;
  date?: string;
  page?: number;
  limit?: number;
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reminderService.getReminders(params);
      setReminders(data.reminders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [JSON.stringify(params)]);

  const createReminder = async (reminderData: any) => {
    try {
      const newReminder = await reminderService.createReminder(reminderData);
      setReminders(prev => [newReminder, ...prev]);
      return newReminder;
    } catch (err) {
      throw err;
    }
  };

  const updateReminder = async (id: string, reminderData: any) => {
    try {
      const updatedReminder = await reminderService.updateReminder(id, reminderData);
      setReminders(prev => prev.map(reminder => reminder._id === id ? updatedReminder : reminder));
      return updatedReminder;
    } catch (err) {
      throw err;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      setReminders(prev => prev.filter(reminder => reminder._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    reminders,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder
  };
};

export const useUpcomingReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reminderService.getUpcomingReminders();
      setReminders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingReminders();
  }, []);

  const createReminder = async (reminderData: any) => {
    try {
      const newReminder = await reminderService.createReminder(reminderData);
      setReminders(prev => [newReminder, ...prev]);
      return newReminder;
    } catch (err) {
      throw err;
    }
  };

  const updateReminder = async (id: string, reminderData: any) => {
    try {
      const updatedReminder = await reminderService.updateReminder(id, reminderData);
      setReminders(prev => prev.map(reminder => reminder._id === id ? updatedReminder : reminder));
      return updatedReminder;
    } catch (err) {
      throw err;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      setReminders(prev => prev.filter(reminder => reminder._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { 
    reminders, 
    loading, 
    error, 
    refetch: fetchUpcomingReminders,
    createReminder,
    updateReminder,
    deleteReminder
  };
};
