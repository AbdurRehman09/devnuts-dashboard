"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Project } from '@/services/projectService';

const ProjectProgress = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health?: string) => {
    switch (health) {
      case 'good': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-6 border border-border shadow-lg"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-6 border border-border shadow-lg"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading projects: {error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-border shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Project Progress</h3>
          <p className="text-sm text-muted-foreground">Track your project milestones and progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {projects.map((project: Project, index: number) => {
          const HealthIcon = getHealthIcon(project.health);
          
          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <HealthIcon className={`w-4 h-4 ${getHealthColor(project.health)}`} />
                      <span className={`text-xs ${getHealthColor(project.health)}`}>
                        {project.health || 'unknown'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>PM: {project.projectManager}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>Priority: {project.priority}</span>
                    </div>
                  </div>

                  {/* Team Members */}
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Team:</div>
                      <div className="flex flex-wrap gap-1">
                        {project.teamMembers.slice(0, 3).map((member, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-accent/50 text-accent-foreground rounded text-xs"
                          >
                            {member.name}
                          </span>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <span className="px-2 py-1 bg-accent/50 text-accent-foreground rounded text-xs">
                            +{project.teamMembers.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  {project.milestones && project.milestones.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Recent Milestones:</div>
                      <div className="space-y-1">
                        {project.milestones.slice(0, 2).map((milestone, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-500' : 
                              milestone.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <span className="text-muted-foreground">{milestone.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No projects found</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectProgress;
