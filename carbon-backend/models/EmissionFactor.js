// models/EmissionFactor.js
const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['transport', 'home', 'electricity', 'food', 'purchases', 'water', 'electronics']
  },
  name: {
    type: String,
    required: true
  },
  factor: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  source: String,
  description: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);