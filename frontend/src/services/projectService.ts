import api from './api';

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  joinedDate: string;
}

export interface Milestone {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: string;
}

export interface Client {
  name: string;
  email: string;
  company: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate?: string;
  expectedEndDate?: string;
  budget: {
    allocated: number;
    spent: number;
  };
  teamMembers: TeamMember[];
  projectManager: string;
  client?: Client;
  milestones: Milestone[];
  tags: string[];
  documents: Array<{
    name: string;
    url: string;
    uploadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
  health?: 'good' | 'warning' | 'critical' | 'unknown';
  tasks?: any[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  progress?: number;
  priority?: 'low' | 'medium' | 'high';
  startDate: string;
  endDate?: string;
  expectedEndDate?: string;
  budget?: {
    allocated: number;
    spent: number;
  };
  teamMembers?: TeamMember[];
  projectManager: string;
  client?: Client;
  milestones?: Milestone[];
  tags?: string[];
}

export const projectService = {
  // Get all projects
  getProjects: async (params?: {
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project with tasks
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project
  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Update project progress
  updateProjectProgress: async (id: string): Promise<Project> => {
    const response = await api.put(`/projects/${id}/progress`);
    return response.data;
  },

  // Add milestone
  addMilestone: async (id: string, milestone: Omit<Milestone, '_id'>): Promise<Project> => {
    const response = await api.post(`/projects/${id}/milestones`, milestone);
    return response.data;
  },

  // Update milestone
  updateMilestone: async (projectId: string, milestoneId: string, status: string): Promise<Project> => {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, { status });
    return response.data;
  },

  // Get project statistics
  getProjectStats: async () => {
    const response = await api.get('/projects/stats');
    return response.data;
  },
};
