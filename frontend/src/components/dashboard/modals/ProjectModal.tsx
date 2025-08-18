"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, UserPlus, Plus } from 'lucide-react';
import { Project } from '@/services/projectService';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSave: (projectData: any) => void;
  onDelete?: (projectId: string) => void;
  mode: 'create' | 'edit';
}

const ProjectModal = ({ isOpen, onClose, project, onSave, onDelete, mode }: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    progress: 0,
    budget: '',
    teamMembers: [''],
    milestones: [{ title: '', description: '', dueDate: '', status: 'pending' }],
    tags: [''],
    client: '',
    manager: ''
  });

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
        progress: project.progress || 0,
        budget: project.budget?.allocated?.toString() || '',
        teamMembers: project.teamMembers && project.teamMembers.length > 0 ? 
          project.teamMembers.map(m => typeof m === 'string' ? m : m.name) : [''],
        milestones: project.milestones && project.milestones.length > 0 ? 
          project.milestones.map(m => ({
            title: m.title || '',
            description: m.description || '',
            dueDate: m.dueDate ? m.dueDate.split('T')[0] : '',
            status: m.status || 'pending'
          })) : [{ title: '', description: '', dueDate: '', status: 'pending' }],
        tags: project.tags && project.tags.length > 0 ? project.tags : [''],
        client: typeof project.client === 'string' ? project.client : project.client?.name || '',
        manager: project.projectManager || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        progress: 0,
        budget: '',
        teamMembers: [''],
        milestones: [{ title: '', description: '', dueDate: '', status: 'pending' }],
        tags: [''],
        client: '',
        manager: ''
      });
    }
  }, [project, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty arrays
    const filteredTeamMembers = formData.teamMembers.filter(m => m.trim() !== '');
    const filteredTags = formData.tags.filter(t => t.trim() !== '');
    const filteredMilestones = formData.milestones.filter(m => m.title.trim() !== '');
    
    const submitData = {
      ...formData,
      // Convert empty strings to undefined for optional fields
      projectManager: formData.manager.trim() || undefined, // Correct field name
      client: formData.client.trim() || undefined,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      progress: Number(formData.progress),
      teamMembers: filteredTeamMembers,
      tags: filteredTags,
      milestones: filteredMilestones.map(m => ({
        ...m,
        dueDate: m.dueDate ? new Date(m.dueDate).toISOString() : undefined
      }))
    };
    
    onSave(submitData);
    onClose();
  };

  const handleDelete = () => {
    if (project && onDelete && confirm('Are you sure you want to delete this project?')) {
      onDelete(project._id);
      onClose();
    }
  };

  // Team Members functions
  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ''] });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: newMembers });
  };

  const updateTeamMember = (index: number, value: string) => {
    const newMembers = [...formData.teamMembers];
    newMembers[index] = value;
    setFormData({ ...formData, teamMembers: newMembers });
  };

  // Tags functions
  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  // Milestones functions
  const addMilestone = () => {
    setFormData({ 
      ...formData, 
      milestones: [...formData.milestones, { title: '', description: '', dueDate: '', status: 'pending' }] 
    });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg p-6 w-full max-w-4xl border border-border max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Create New Project' : 'Edit Project'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Basic Information</h4>
            
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status, Priority, Progress */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Progress ({formData.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Dates and Budget */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Client & Manager */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Manager
                </label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-foreground">Team Members</h4>
              <button
                type="button"
                onClick={addTeamMember}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateTeamMember(index, e.target.value)}
                    placeholder="Team member name"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-foreground">Tags</h4>
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Tag
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder="Tag name"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-foreground">Milestones</h4>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>
            <div className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Milestone {index + 1}</span>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      placeholder="Milestone title"
                      className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <select
                        value={milestone.status}
                        onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    placeholder="Milestone description"
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            )}
            
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                {mode === 'create' ? 'Create Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
