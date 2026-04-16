// carbon-backend/routes/emissionFactors.js
const express = require('express');
const router = express.Router();
const EmissionFactor = require('../models/EmissionFactor');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const factors = await EmissionFactor.find().select('-__v');
    res.json({
      success: true,
      count: factors.length,
      data: factors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:activityId', async (req, res) => {
  try {
    const factor = await EmissionFactor.findOne({ 
      activityId: req.params.activityId 
    });
    
    if (!factor) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }
    
    res.json({
      success: true,
      data: factor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const factor = await EmissionFactor.create(req.body);
    res.status(201).json({
      success: true,
      data: factor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const factor = await EmissionFactor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!factor) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }
    
    res.json({
      success: true,
      data: factor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const factor = await EmissionFactor.findByIdAndDelete(req.params.id);
    
    if (!factor) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Emission factor deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;