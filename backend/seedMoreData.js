const mongoose = require('mongoose');
const Task = require('./models/Task');
const Project = require('./models/Project');
const Meeting = require('./models/Meeting');
const Reminder = require('./models/Reminder');
const Goal = require('./models/Goal');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/devnuts_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedMoreData = async () => {
  try {
    console.log('Adding more data for better visualization...');

    // Add more projects
    const moreProjects = await Project.insertMany([
      {
        name: 'AI Chatbot Integration',
        description: 'Integrate advanced AI chatbot for customer support',
        status: 'active',
        progress: 85,
        priority: 'high',
        startDate: new Date('2024-01-01'),
        expectedEndDate: new Date('2024-02-15'),
        projectManager: 'Alex Rodriguez',
        teamMembers: [
          { name: 'Sarah Kim', role: 'AI Engineer', email: 'sarah@example.com' },
          { name: 'Tom Wilson', role: 'Backend Developer', email: 'tom@example.com' }
        ]
      },
      {
        name: 'Cloud Migration',
        description: 'Migrate entire infrastructure to AWS',
        status: 'active',
        progress: 60,
        priority: 'high',
        startDate: new Date('2024-01-10'),
        expectedEndDate: new Date('2024-03-30'),
        projectManager: 'Maria Garcia',
        teamMembers: [
          { name: 'James Lee', role: 'DevOps Engineer', email: 'james@example.com' },
          { name: 'Lisa Chen', role: 'Cloud Architect', email: 'lisa@example.com' }
        ]
      },
      {
        name: 'Marketing Website Redesign',
        description: 'Complete overhaul of marketing website',
        status: 'completed',
        progress: 100,
        priority: 'medium',
        startDate: new Date('2023-12-01'),
        expectedEndDate: new Date('2024-01-20'),
        projectManager: 'Kevin Brown'
      },
      {
        name: 'Security Audit & Compliance',
        description: 'Comprehensive security audit and GDPR compliance',
        status: 'planning',
        progress: 25,
        priority: 'high',
        startDate: new Date('2024-02-01'),
        expectedEndDate: new Date('2024-04-15'),
        projectManager: 'Diana Foster'
      }
    ]);

    console.log('Added more projects');

    // Add more tasks with varied dates for analytics
    const today = new Date();
    const moreTasks = [];
    
    // Generate tasks for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const taskCount = Math.floor(Math.random() * 5) + 1; // 1-5 tasks per day
      
      for (let j = 0; j < taskCount; j++) {
        const statuses = ['completed', 'inprogress', 'new', 'closed'];
        const priorities = ['low', 'medium', 'high'];
        const assignees = ['John Smith', 'Sarah Davis', 'Mike Chen', 'Emma Brown', 'Alex Rodriguez', 'Maria Garcia'];
        const assigners = ['Product Manager', 'Team Lead', 'CTO', 'Project Manager'];
        
        const taskNames = [
          'Code Review', 'Bug Fix', 'Feature Implementation', 'Testing', 'Documentation',
          'API Integration', 'Database Migration', 'UI/UX Updates', 'Performance Optimization',
          'Security Enhancement', 'Mobile Responsiveness', 'Error Handling'
        ];
        
        moreTasks.push({
          title: `${taskNames[Math.floor(Math.random() * taskNames.length)]} - ${date.toLocaleDateString()}`,
          description: `Task created on ${date.toLocaleDateString()}`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          assignedBy: assigners[Math.floor(Math.random() * assigners.length)],
          assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
          progress: Math.floor(Math.random() * 101),
          project: moreProjects[Math.floor(Math.random() * moreProjects.length)]._id,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    await Task.insertMany(moreTasks);
    console.log(`Added ${moreTasks.length} more tasks`);

    // Add more meetings
    const moreMeetings = [];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + Math.floor(Math.random() * 14)); // Next 2 weeks
      
      const meetingTypes = ['video-call', 'in-person', 'phone-call'];
      const organizers = ['John Smith', 'Sarah Davis', 'Mike Chen', 'Emma Brown'];
      const titles = [
        'Daily Standup', 'Sprint Planning', 'Code Review', 'Client Meeting',
        'Team Sync', 'Architecture Discussion', 'Project Kickoff', 'Retrospective'
      ];
      
      moreMeetings.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Team collaboration meeting',
        meetingDate: date,
        startTime: `${9 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
        endTime: `${10 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
        duration: 30 + Math.floor(Math.random() * 90),
        organizer: organizers[Math.floor(Math.random() * organizers.length)],
        meetingType: meetingTypes[Math.floor(Math.random() * meetingTypes.length)],
        status: 'scheduled',
        participants: [
          { name: 'Team Member 1', email: 'member1@example.com', status: 'accepted' },
          { name: 'Team Member 2', email: 'member2@example.com', status: 'pending' }
        ],
        project: moreProjects[Math.floor(Math.random() * moreProjects.length)]._id
      });
    }

    await Meeting.insertMany(moreMeetings);
    console.log('Added more meetings');

    // Add more reminders
    const moreReminders = [];
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + Math.floor(Math.random() * 30)); // Next month
      
      const categories = ['work', 'personal', 'meeting', 'deadline'];
      const priorities = ['low', 'medium', 'high'];
      const titles = [
        'Submit Report', 'Review Code', 'Call Client', 'Update Documentation',
        'Backup Files', 'Team Meeting', 'Project Deadline', 'Performance Review'
      ];
      
      moreReminders.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Important reminder',
        reminderDate: date,
        reminderTime: `${9 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
        status: Math.random() > 0.3 ? 'pending' : 'completed',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }

    await Reminder.insertMany(moreReminders);
    console.log('Added more reminders');

    // Add Goals
    const goals = await Goal.insertMany([
      {
        title: 'Complete 50 Tasks This Month',
        description: 'Finish 50 development tasks to improve productivity',
        targetValue: 50,
        currentValue: 32,
        unit: 'tasks',
        category: 'work',
        priority: 'high',
        status: 'active',
        startDate: new Date('2024-02-01'),
        targetDate: new Date('2024-02-29'),
        color: '#10b981'
      },
      {
        title: 'Learn 3 New Technologies',
        description: 'Master React Native, GraphQL, and Docker',
        targetValue: 3,
        currentValue: 1,
        unit: 'technologies',
        category: 'learning',
        priority: 'medium',
        status: 'active',
        startDate: new Date('2024-01-01'),
        targetDate: new Date('2024-03-31'),
        color: '#f59e0b'
      },
      {
        title: 'Reduce Bug Count to Zero',
        description: 'Fix all outstanding bugs in the system',
        targetValue: 25,
        currentValue: 18,
        unit: 'bugs fixed',
        category: 'work',
        priority: 'high',
        status: 'active',
        startDate: new Date('2024-02-01'),
        targetDate: new Date('2024-02-20'),
        color: '#ef4444'
      },
      {
        title: 'Improve Code Coverage',
        description: 'Increase test coverage to 90%',
        targetValue: 90,
        currentValue: 75,
        unit: 'percentage',
        category: 'work',
        priority: 'medium',
        status: 'active',
        startDate: new Date('2024-01-15'),
        targetDate: new Date('2024-03-15'),
        color: '#8b5cf6'
      },
      {
        title: 'Complete Certification',
        description: 'Finish AWS Solutions Architect certification',
        targetValue: 1,
        currentValue: 0,
        unit: 'certification',
        category: 'learning',
        priority: 'medium',
        status: 'active',
        startDate: new Date('2024-02-01'),
        targetDate: new Date('2024-04-30'),
        color: '#06b6d4'
      },
      {
        title: 'Team Performance Goal',
        description: 'Achieve 95% sprint completion rate',
        targetValue: 95,
        currentValue: 87,
        unit: 'percentage',
        category: 'work',
        priority: 'high',
        status: 'active',
        startDate: new Date('2024-01-01'),
        targetDate: new Date('2024-06-30'),
        color: '#f97316'
      }
    ]);

    console.log('Added goals');
    console.log('Successfully added more sample data for better visualization!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding more data:', error);
    mongoose.connection.close();
  }
};

seedMoreData();
