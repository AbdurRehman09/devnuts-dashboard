"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Search, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

const ProjectsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleCreateProject = () => {
    const newProject = {
      name: 'New Project',
      description: 'Project description',
      status: 'planning',
      progress: 0,
      priority: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      projectManager: 'You',
      teamMembers: [],
      milestones: []
    };
    
    createProject(newProject).then(() => {
      console.log('Project created');
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} />
        </div>
        
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <div className="lg:hidden">
              <Sidebar isOpen={isSidebarOpen} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Project Progress</h1>
                <p className="text-muted-foreground">Track and manage your project milestones</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Add Project Button */}
                <button 
                  onClick={handleCreateProject}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>

              {/* Projects Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-2">Error loading projects</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority} priority
                            </span>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{project.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">Progress</span>
                              <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className="bg-primary rounded-full h-3 transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>PM: {project.projectManager}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                            </div>
                            {project.expectedEndDate && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(project.expectedEndDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Team Members */}
                          {project.teamMembers && project.teamMembers.length > 0 && (
                            <div className="mt-4">
                              <div className="text-sm text-muted-foreground mb-2">Team:</div>
                              <div className="flex flex-wrap gap-2">
                                {project.teamMembers.slice(0, 4).map((member, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-accent/50 text-accent-foreground rounded text-sm"
                                  >
                                    {member.name}
                                  </span>
                                ))}
                                {project.teamMembers.length > 4 && (
                                  <span className="px-2 py-1 bg-accent/50 text-accent-foreground rounded text-sm">
                                    +{project.teamMembers.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-blue-500 hover:underline">
                            Edit
                          </button>
                          <button className="text-sm text-green-500 hover:underline">
                            View Details
                          </button>
                          <button className="text-sm text-red-500 hover:underline">
                            Archive
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No projects found</p>
                  <p className="text-sm text-muted-foreground">Create your first project to get started</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
