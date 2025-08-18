import api from './api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'new' | 'inprogress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedBy: string;
  assignedTo: string;
  progress: number;
  dueDate?: string;
  project?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  statusBreakdown: Array<{ _id: string; count: number }>;
  totalTasks: number;
  averageProgress: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'new' | 'inprogress' | 'completed' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  assignedBy: string;
  assignedTo: string;
  progress?: number;
  dueDate?: string;
  project?: string;
  tags?: string[];
}

export const taskService = {
  // Get all tasks
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    project?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, data: Partial<CreateTaskData>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Get task statistics
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};
