const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project with tasks
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get project tasks
    const tasks = await Task.find({ project: req.params.id });
    
    res.json({
      ...project.toObject(),
      tasks,
      health: project.health
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = new Project(req.body);
    const savedProject = await project.save();
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Optional: Also delete related tasks
    await Task.deleteMany({ project: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project progress based on tasks
const updateProjectProgress = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Calculate progress based on tasks
    const tasks = await Task.find({ project: projectId });
    
    if (tasks.length === 0) {
      return res.json({ message: 'No tasks found for this project' });
    }

    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    const averageProgress = Math.round(totalProgress / tasks.length);

    const project = await Project.findByIdAndUpdate(
      projectId,
      { progress: averageProgress, updatedAt: Date.now() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add milestone to project
const addMilestone = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.milestones.push({ title, description, dueDate });
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update milestone status
const updateMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { status } = req.body;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const milestone = project.milestones.id(milestoneId);
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = status;
    if (status === 'completed') {
      milestone.completedDate = new Date();
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project statistics
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProjects = await Project.countDocuments();
    const averageProgress = await Project.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    const activeProjects = await Project.countDocuments({ status: 'active' });

    res.json({
      statusBreakdown: stats,
      totalProjects,
      activeProjects,
      averageProgress: averageProgress[0]?.avgProgress || 0
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  addMilestone,
  updateMilestone,
  getProjectStats
};
