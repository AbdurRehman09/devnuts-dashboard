import api from './api';

export interface Participant {
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
}

export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  meetingType: 'in-person' | 'video-call' | 'phone-call';
  meetingLink?: string;
  organizer: string;
  participants: Participant[];
  agenda?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  project?: {
    _id: string;
    name: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  meetingType?: 'in-person' | 'video-call' | 'phone-call';
  meetingLink?: string;
  organizer: string;
  participants?: Participant[];
  agenda?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  project?: string;
  notes?: string;
}

export const meetingService = {
  // Get all meetings
  getMeetings: async (params?: {
    status?: string;
    date?: string;
    organizer?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/meetings', { params });
    return response.data;
  },

  // Get single meeting
  getMeeting: async (id: string): Promise<Meeting> => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  // Create new meeting
  createMeeting: async (data: CreateMeetingData): Promise<Meeting> => {
    const response = await api.post('/meetings', data);
    return response.data;
  },

  // Update meeting
  updateMeeting: async (id: string, data: Partial<CreateMeetingData>): Promise<Meeting> => {
    const response = await api.put(`/meetings/${id}`, data);
    return response.data;
  },

  // Delete meeting
  deleteMeeting: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },

  // Get today's meetings
  getTodayMeetings: async (): Promise<Meeting[]> => {
    const response = await api.get('/meetings/today');
    return response.data;
  },

  // Get upcoming meetings
  getUpcomingMeetings: async (): Promise<Meeting[]> => {
    const response = await api.get('/meetings/upcoming');
    return response.data;
  },

  // Get meeting statistics
  getMeetingStats: async () => {
    const response = await api.get('/meetings/stats');
    return response.data;
  },
};
