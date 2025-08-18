import api from './api';

export interface DashboardAnalytics {
  taskAnalytics: Array<{
    _id: string;
    completed: number;
    inProgress: number;
    new: number;
    closed: number;
  }>;
  taskStats: Array<{ _id: string; count: number }>;
  projectStats: Array<{ _id: string; count: number }>;
  goalsData: Array<{
    _id: string;
    name: string;
    progress: number;
    status: string;
    priority: string;
  }>;
  todayMeetings: number;
  pendingReminders: number;
}

export interface ProductivityAnalytics {
  productivityData: Array<{
    _id: string;
    completedTasks: number;
    totalProgress: number;
  }>;
  averageCompletionTime: number;
}

export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get productivity analytics
  getProductivityAnalytics: async (period: string = '7'): Promise<ProductivityAnalytics> => {
    const response = await api.get('/analytics/productivity', {
      params: { period }
    });
    return response.data;
  },
};
