const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  reps: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const loggedExerciseSchema = new mongoose.Schema({
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
    default: 'Other',
  },
  gifUrl: {
    type: String,
    default: '',
  },
  sets: [setSchema],
  notes: {
    type: String,
    default: '',
  },
});

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    title: {
      type: String,
      default: 'Daily Workout',
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    exercises: [loggedExerciseSchema],
    notes: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index so a user easily queries by date
workoutLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);

