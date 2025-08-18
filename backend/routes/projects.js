const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  addMilestone,
  updateMilestone,
  getProjectStats
} = require('../controllers/projectController');
const { projectValidation } = require('../middleware/validation');

// @route   GET /api/projects
// @desc    Get all projects with optional filters
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/stats
// @desc    Get project statistics
// @access  Public
router.get('/stats', getProjectStats);

// @route   GET /api/projects/:id
// @desc    Get single project with tasks
// @access  Public
router.get('/:id', getProject);

// @route   POST /api/projects
// @desc    Create new project
// @access  Public
router.post('/', projectValidation, createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Public
router.put('/:id', projectValidation, updateProject);

// @route   PUT /api/projects/:id/progress
// @desc    Update project progress based on tasks
// @access  Public
router.put('/:id/progress', updateProjectProgress);

// @route   POST /api/projects/:id/milestones
// @desc    Add milestone to project
// @access  Public
router.post('/:id/milestones', addMilestone);

// @route   PUT /api/projects/:projectId/milestones/:milestoneId
// @desc    Update milestone status
// @access  Public
router.put('/:projectId/milestones/:milestoneId', updateMilestone);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Public
router.delete('/:id', deleteProject);

module.exports = router;
