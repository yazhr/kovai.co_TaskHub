const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Planned', 'In Progress', 'Complete'], default: 'Planned' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
