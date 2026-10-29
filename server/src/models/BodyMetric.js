const mongoose = require('mongoose');

const bodyMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    bodyFat: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

bodyMetricSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('BodyMetric', bodyMetricSchema);

