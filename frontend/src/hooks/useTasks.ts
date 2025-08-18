import { useState, useEffect } from 'react';
import { taskService, Task, TaskStats } from '@/services/taskService';

export const useTasks = (params?: {
  status?: string;
  priority?: string;
  project?: string;
  page?: number;
  limit?: number;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(params);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [JSON.stringify(params)]);

  const createTask = async (taskData: any) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (id: string, taskData: any) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};

export const useTaskStats = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await taskService.getTaskStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
