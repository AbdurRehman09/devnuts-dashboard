import { useState, useEffect } from 'react';
import { goalService, Goal } from '@/services/goalService';

export const useGoals = (params?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalService.getGoals(params);
      setGoals(data.goals);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [JSON.stringify(params)]);

  const createGoal = async (goalData: any) => {
    try {
      const newGoal = await goalService.createGoal(goalData);
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      throw err;
    }
  };

  const updateGoal = async (id: string, goalData: any) => {
    try {
      const updatedGoal = await goalService.updateGoal(id, goalData);
      setGoals(prev => prev.map(goal => goal._id === id ? updatedGoal : goal));
      return updatedGoal;
    } catch (err) {
      throw err;
    }
  };

  const updateGoalProgress = async (id: string, currentValue: number) => {
    try {
      const updatedGoal = await goalService.updateGoalProgress(id, currentValue);
      setGoals(prev => prev.map(goal => goal._id === id ? updatedGoal : goal));
      return updatedGoal;
    } catch (err) {
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal
  };
};

export const useGoalStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await goalService.getGoalStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goal stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
