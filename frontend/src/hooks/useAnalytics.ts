import { useState, useEffect } from 'react';
import { analyticsService, DashboardAnalytics, ProductivityAnalytics } from '@/services/analyticsService';

export const useDashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

export const useProductivityAnalytics = (period: string = '7') => {
  const [analytics, setAnalytics] = useState<ProductivityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getProductivityAnalytics(period);
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch productivity analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { analytics, loading, error };
};
