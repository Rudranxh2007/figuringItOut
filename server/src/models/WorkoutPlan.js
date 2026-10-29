const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    dayOfWeek: {
      type: [Number], // 0 = Sunday, 1 = Monday, etc.
      default: [],
    },
    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
        },
        name: {
          type: String,
          required: true,
        },
        muscleGroup: {
          type: String,
          default: 'Full Body',
        },
        gifUrl: {
          type: String,
          default: '',
        },
        targetSets: {
          type: Number,
          default: 3,
        },
        targetReps: {
          type: String,
          default: '8-12',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

