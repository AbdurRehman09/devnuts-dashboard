const mongoose = require('mongoose');
const Task = require('./models/Task');
const Project = require('./models/Project');
const Meeting = require('./models/Meeting');
const Reminder = require('./models/Reminder');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/devnuts_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await Task.deleteMany({});
    await Project.deleteMany({});
    await Meeting.deleteMany({});
    await Reminder.deleteMany({});

    console.log('Cleared existing data');

    // Create sample projects
    const projects = await Project.insertMany([
      {
        name: 'E-commerce Website',
        description: 'Building a modern e-commerce platform',
        status: 'active',
        progress: 75,
        priority: 'high',
        startDate: new Date('2024-01-15'),
        expectedEndDate: new Date('2024-03-15'),
        projectManager: 'John Smith',
        teamMembers: [
          { name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@example.com' },
          { name: 'Bob Wilson', role: 'Backend Developer', email: 'bob@example.com' }
        ],
        milestones: [
          { title: 'Design Phase', description: 'Complete UI/UX design', dueDate: new Date('2024-02-01'), status: 'completed' },
          { title: 'Development Phase', description: 'Core functionality', dueDate: new Date('2024-02-28'), status: 'pending' }
        ]
      },
      {
        name: 'Mobile App Development',
        description: 'React Native mobile application',
        status: 'active',
        progress: 45,
        priority: 'medium',
        startDate: new Date('2024-02-01'),
        expectedEndDate: new Date('2024-04-30'),
        projectManager: 'Sarah Davis',
        teamMembers: [
          { name: 'Mike Chen', role: 'Mobile Developer', email: 'mike@example.com' },
          { name: 'Emma Brown', role: 'UI Designer', email: 'emma@example.com' }
        ]
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Business intelligence dashboard',
        status: 'planning',
        progress: 15,
        priority: 'medium',
        startDate: new Date('2024-02-15'),
        expectedEndDate: new Date('2024-05-15'),
        projectManager: 'David Lee'
      }
    ]);

    console.log('Created sample projects');

    // Create sample tasks
    await Task.insertMany([
      {
        title: 'Design product catalog page',
        description: 'Create responsive product listing with filters',
        status: 'completed',
        priority: 'high',
        assignedBy: 'John Smith',
        assignedTo: 'Alice Johnson',
        progress: 100,
        project: projects[0]._id,
        dueDate: new Date('2024-02-10')
      },
      {
        title: 'Implement payment gateway',
        description: 'Integrate Stripe payment processing',
        status: 'inprogress',
        priority: 'high',
        assignedBy: 'John Smith',
        assignedTo: 'Bob Wilson',
        progress: 60,
        project: projects[0]._id,
        dueDate: new Date('2024-02-20')
      },
      {
        title: 'Setup mobile navigation',
        description: 'Implement bottom tab navigation',
        status: 'inprogress',
        priority: 'medium',
        assignedBy: 'Sarah Davis',
        assignedTo: 'Mike Chen',
        progress: 40,
        project: projects[1]._id,
        dueDate: new Date('2024-02-25')
      },
      {
        title: 'Create user authentication',
        description: 'Login and registration functionality',
        status: 'new',
        priority: 'high',
        assignedBy: 'Sarah Davis',
        assignedTo: 'Mike Chen',
        progress: 0,
        project: projects[1]._id,
        dueDate: new Date('2024-03-01')
      },
      {
        title: 'Database schema design',
        description: 'Design data warehouse schema',
        status: 'new',
        priority: 'medium',
        assignedBy: 'David Lee',
        assignedTo: 'John Smith',
        progress: 0,
        project: projects[2]._id,
        dueDate: new Date('2024-03-05')
      },
      {
        title: 'API testing and documentation',
        description: 'Write comprehensive API tests',
        status: 'closed',
        priority: 'low',
        assignedBy: 'John Smith',
        assignedTo: 'Bob Wilson',
        progress: 100,
        project: projects[0]._id
      }
    ]);

    console.log('Created sample tasks');

    // Create sample meetings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Meeting.insertMany([
      {
        title: 'Daily Standup',
        description: 'Team sync meeting',
        meetingDate: today,
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        organizer: 'John Smith',
        meetingType: 'video-call',
        status: 'scheduled',
        participants: [
          { name: 'Alice Johnson', email: 'alice@example.com', status: 'accepted' },
          { name: 'Bob Wilson', email: 'bob@example.com', status: 'accepted' }
        ],
        project: projects[0]._id
      },
      {
        title: 'Sprint Planning',
        description: 'Plan next sprint tasks',
        meetingDate: tomorrow,
        startTime: '14:00',
        endTime: '16:00',
        duration: 120,
        organizer: 'Sarah Davis',
        meetingType: 'in-person',
        status: 'scheduled',
        participants: [
          { name: 'Mike Chen', email: 'mike@example.com', status: 'pending' },
          { name: 'Emma Brown', email: 'emma@example.com', status: 'accepted' }
        ],
        project: projects[1]._id
      },
      {
        title: 'Client Review',
        description: 'Present project progress to client',
        meetingDate: today,
        startTime: '15:30',
        endTime: '16:30',
        duration: 60,
        organizer: 'John Smith',
        meetingType: 'video-call',
        status: 'scheduled',
        participants: [
          { name: 'Client Representative', email: 'client@company.com', status: 'pending' }
        ],
        project: projects[0]._id
      }
    ]);

    console.log('Created sample meetings');

    // Create sample reminders
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Reminder.insertMany([
      {
        title: 'Submit timesheet',
        description: 'Weekly timesheet submission deadline',
        reminderDate: today,
        reminderTime: '17:00',
        status: 'pending',
        priority: 'medium',
        category: 'work'
      },
      {
        title: 'Code review deadline',
        description: 'Review pending pull requests',
        reminderDate: tomorrow,
        reminderTime: '10:00',
        status: 'pending',
        priority: 'high',
        category: 'work'
      },
      {
        title: 'Team lunch',
        description: 'Monthly team lunch gathering',
        reminderDate: nextWeek,
        reminderTime: '12:00',
        status: 'pending',
        priority: 'low',
        category: 'personal'
      },
      {
        title: 'Backup project files',
        description: 'Weekly backup of important project files',
        reminderDate: today,
        reminderTime: '18:00',
        status: 'completed',
        priority: 'medium',
        category: 'work',
        isRecurring: true,
        recurringType: 'weekly'
      }
    ]);

    console.log('Created sample reminders');
    console.log('Sample data seeded successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedData();
