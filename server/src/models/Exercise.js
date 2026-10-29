const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    muscleGroup: {
      type: String,
      required: true,
      enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Core', 'Cardio', 'Full Body', 'Arms'],
    },
    equipment: {
      type: String,
      default: 'Barbell/Dumbbell',
    },
    description: {
      type: String,
      default: '',
    },
    gifUrl: {
      type: String,
      default: '',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for pre-built global exercises
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);

