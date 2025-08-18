import api from './api';

export interface Reminder {
  _id: string;
  title: string;
  description?: string;
  reminderDate: string;
  reminderTime: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'meeting' | 'deadline' | 'other';
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderData {
  title: string;
  description?: string;
  reminderDate: string;
  reminderTime: string;
  status?: 'pending' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  category?: 'personal' | 'work' | 'meeting' | 'deadline' | 'other';
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const reminderService = {
  // Get all reminders
  getReminders: async (params?: {
    status?: string;
    category?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/reminders', { params });
    return response.data;
  },

  // Get single reminder
  getReminder: async (id: string): Promise<Reminder> => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },

  // Create new reminder
  createReminder: async (data: CreateReminderData): Promise<Reminder> => {
    const response = await api.post('/reminders', data);
    return response.data;
  },

  // Update reminder
  updateReminder: async (id: string, data: Partial<CreateReminderData>): Promise<Reminder> => {
    const response = await api.put(`/reminders/${id}`, data);
    return response.data;
  },

  // Delete reminder
  deleteReminder: async (id: string): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },

  // Get upcoming reminders
  getUpcomingReminders: async (): Promise<Reminder[]> => {
    const response = await api.get('/reminders/upcoming');
    return response.data;
  },

  // Get reminder statistics
  getReminderStats: async () => {
    const response = await api.get('/reminders/stats');
    return response.data;
  },
};
