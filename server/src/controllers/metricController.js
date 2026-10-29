const BodyMetric = require('../models/BodyMetric');

// @desc Get all body metrics for user (e.g. for weight progression chart)
// @route GET /api/metrics
const getMetrics = async (req, res) => {
  try {
    const metrics = await BodyMetric.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, count: metrics.length, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add or update body metric for a date
// @route POST /api/metrics
const logMetric = async (req, res) => {
  try {
    const { date, weight, unit, bodyFat, notes } = req.body;

    if (!date || weight === undefined) {
      return res.status(400).json({ success: false, message: 'Date and weight are required' });
    }

    let metric = await BodyMetric.findOne({ user: req.user._id, date });

    if (metric) {
      metric.weight = weight;
      if (unit) metric.unit = unit;
      if (bodyFat !== undefined) metric.bodyFat = bodyFat;
      if (notes !== undefined) metric.notes = notes;
      await metric.save();
    } else {
      metric = await BodyMetric.create({
        user: req.user._id,
        date,
        weight,
        unit: unit || 'kg',
        bodyFat: bodyFat || null,
        notes: notes || '',
      });
    }

    res.status(200).json({ success: true, data: metric });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a body metric
// @route DELETE /api/metrics/:id
const deleteMetric = async (req, res) => {
  try {
    const metric = await BodyMetric.findOne({ _id: req.params.id, user: req.user._id });
    if (!metric) {
      return res.status(404).json({ success: false, message: 'Metric record not found' });
    }

    await metric.deleteOne();
    res.json({ success: true, message: 'Metric deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMetrics,
  logMetric,
  deleteMetric,
};

