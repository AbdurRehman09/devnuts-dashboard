import { useState, useEffect } from 'react';
import { projectService, Project } from '@/services/projectService';

export const useProjects = (params?: {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects(params);
      setProjects(data.projects);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [JSON.stringify(params)]);

  const createProject = async (projectData: any) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: any) => {
    try {
      const updatedProject = await projectService.updateProject(id, projectData);
      setProjects(prev => prev.map(project => project._id === id ? updatedProject : project));
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProject(id);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const updateProjectProgress = async () => {
    try {
      const updatedProject = await projectService.updateProjectProgress(id);
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  const addMilestone = async (milestone: any) => {
    try {
      const updatedProject = await projectService.addMilestone(id, milestone);
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
    updateProjectProgress,
    addMilestone
  };
};
