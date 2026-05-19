const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const userId = req.header('x-user-id') || req.body.userId;
  if (!userId) return res.status(400).json({ error: 'Missing user id' });

  const { title, priority = 'Medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  if (!['Low', 'Medium', 'High'].includes(priority)) return res.status(400).json({ error: 'Invalid priority' });

  try {
    const task = new Task({ title, priority, userId });
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
