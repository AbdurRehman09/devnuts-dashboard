import api from './api';

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'personal' | 'work' | 'health' | 'learning' | 'financial' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  targetDate: string;
  completedDate?: string;
  color: string;
  tags: string[];
  milestones: Array<{
    title: string;
    targetValue: number;
    achievedDate?: string;
    isAchieved: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
  progress: number;
  isOverdue: boolean;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  targetValue: number;
  currentValue?: number;
  unit?: string;
  category?: 'personal' | 'work' | 'health' | 'learning' | 'financial' | 'other';
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  targetDate: string;
  color?: string;
  tags?: string[];
}

export const goalService = {
  // Get all goals
  getGoals: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  // Get single goal
  getGoal: async (id: string): Promise<Goal> => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Create new goal
  createGoal: async (data: CreateGoalData): Promise<Goal> => {
    const response = await api.post('/goals', data);
    return response.data;
  },

  // Update goal
  updateGoal: async (id: string, data: Partial<CreateGoalData>): Promise<Goal> => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  // Update goal progress
  updateGoalProgress: async (id: string, currentValue: number): Promise<Goal> => {
    const response = await api.put(`/goals/${id}/progress`, { currentValue });
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  // Get goal statistics
  getGoalStats: async () => {
    const response = await api.get('/goals/stats');
    return response.data;
  },
};
