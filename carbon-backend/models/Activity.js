// models/Activity.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Mixed, // Can be number OR string
  emission: Number,
  category: String,
  factor: Number,
  type: String,
  unit: String
}, { _id: false });

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
    of: answerSchema
  },
  categoryTotals: {
    transport: Number,
    home: Number,
    electronics: Number,
    water: Number,
    food: Number
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