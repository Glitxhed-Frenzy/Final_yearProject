// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  answers: {
    type: Map,
    of: {
      value: Number,
      emission: Number,
      category: String,
      questionText: String,
      factor: Number
    }
  },
  categoryTotals: {
    transport: Number,
    home: Number,
    electricity: Number,
    food: Number,
    purchases: Number,
    water: Number,
    electronics: Number
  },
  totalEmissions: {
    type: Number,
    required: true
  },
  categories: [String],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);