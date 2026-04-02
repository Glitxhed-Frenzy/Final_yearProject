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
    of: answerSchema
  },
  categoryTotals: {
    transport: Number,
    electricity: Number,
    waste: Number,
    food: Number
  },
  totalEmissions: {
    type: Number,
    required: true
  },
  categories: [String],
  notes: String
}, {
  timestamps: true,
  // FIXED: Ensure dates are stored consistently
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// FIXED: Add virtual field for local date display
activitySchema.virtual('localDate').get(function() {
  const date = new Date(this.date);
  return date.toLocaleDateString();
});

activitySchema.virtual('localDateDisplay').get(function() {
  const date = new Date(this.date);
  const now = new Date();
  
  // Reset to midnight for accurate comparison
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

// FIXED: Add middleware to ensure date is stored with timezone offset
activitySchema.pre('save', function(next) {
  // Ensure the date is stored consistently
  if (this.date) {
    const date = new Date(this.date);
    // Store as UTC midnight for consistent comparison
    this.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  next();
});

module.exports = mongoose.model('Activity', activitySchema);