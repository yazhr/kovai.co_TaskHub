const Task = require('../models/Task');
const ADMIN_EMAIL = 'admin@taskhub.com';
const ADMIN_UID = Buffer.from(ADMIN_EMAIL.toLowerCase()).toString('base64').replace(/=/g, '').slice(0, 28);

exports.createTask = async (req, res) => {
  const userId = req.header('x-user-id') || req.body.userId;
  if (!userId) return res.status(400).json({ error: 'Missing user id' });

  const { title, priority = 'Medium', userName = '', userEmail = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  if (!['Low', 'Medium', 'High'].includes(priority)) return res.status(400).json({ error: 'Invalid priority' });

  try {
    const task = new Task({ title, priority, userId, userName, userEmail });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create task' });
  }
};

exports.getTasks = async (req, res) => {
  const userId = req.header('x-user-id') || req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing user id' });

  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch tasks' });
  }
};

exports.updateTask = async (req, res) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(400).json({ error: 'Missing user id' });

  const { id } = req.params;
  const { status, priority } = req.body;
  if (!status && !priority) return res.status(400).json({ error: 'Missing status or priority' });

  if (status && !['Planned', 'In Progress', 'Complete'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (status) task.status = status;
    if (priority) task.priority = priority;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update task' });
  }
};

exports.getAdminOverview = async (req, res) => {
  const userId = req.header('x-user-id') || req.query.userId;
  if (userId !== ADMIN_UID) return res.status(403).json({ error: 'Unauthorized' });

  try {
    const tasks = await Task.find({}).sort({ updatedAt: -1, createdAt: -1 });
    const usersById = new Map();

    tasks.forEach((task) => {
      if (!usersById.has(task.userId)) {
        usersById.set(task.userId, {
          userId: task.userId,
          userName: task.userName || '',
          userEmail: task.userEmail || '',
          total: 0,
          planned: 0,
          inProgress: 0,
          complete: 0,
          latestTaskAt: null,
          recentTasks: [],
        });
      }

      const user = usersById.get(task.userId);
      user.total += 1;
      if (task.status === 'Planned') user.planned += 1;
      if (task.status === 'In Progress') user.inProgress += 1;
      if (task.status === 'Complete') user.complete += 1;
      if (!user.userName && task.userName) user.userName = task.userName;
      if (!user.userEmail && task.userEmail) user.userEmail = task.userEmail;

      if (!user.latestTaskAt || new Date(task.updatedAt || task.createdAt) > new Date(user.latestTaskAt)) {
        user.latestTaskAt = task.updatedAt || task.createdAt;
      }

      if (user.recentTasks.length < 3) {
        user.recentTasks.push({
          id: task._id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt,
        });
      }
    });

    const users = Array.from(usersById.values())
      .map((user) => ({
        ...user,
        progress: user.total === 0 ? 0 : Math.round((user.complete / user.total) * 100),
      }))
      .sort((left, right) => right.total - left.total || new Date(right.latestTaskAt || 0) - new Date(left.latestTaskAt || 0));

    const summary = tasks.reduce(
      (acc, task) => {
        acc.totalTasks += 1;
        if (task.status === 'Planned') acc.planned += 1;
        if (task.status === 'In Progress') acc.inProgress += 1;
        if (task.status === 'Complete') acc.complete += 1;
        acc.totalUsers = users.length;
        return acc;
      },
      { totalTasks: 0, totalUsers: users.length, planned: 0, inProgress: 0, complete: 0 }
    );

    summary.progress = summary.totalTasks === 0 ? 0 : Math.round((summary.complete / summary.totalTasks) * 100);

    res.json({ summary, users, tasks });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch admin overview' });
  }
};
