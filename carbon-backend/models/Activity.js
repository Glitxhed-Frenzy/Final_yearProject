// models/Activity.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Mixed,
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
    of: answerSchema,
    default: new Map()
  },
  categoryTotals: {
    transport: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    waste: { type: Number, default: 0 },
    food: { type: Number, default: 0 }
  },
  totalEmissions: {
    type: Number,
    required: true,
    default: 0
  },
  categories: {
    type: [String],
    default: []
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

activitySchema.pre('save', function() {
  if (this.date) {
    const date = new Date(this.date);
    this.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }
});

activitySchema.virtual('localDate').get(function() {
  const date = new Date(this.date);
  return date.toLocaleDateString();
});

activitySchema.virtual('localDateDisplay').get(function() {
  const date = new Date(this.date);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today - activityDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
});

module.exports = mongoose.model('Activity', activitySchema);