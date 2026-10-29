const WorkoutLog = require('../models/WorkoutLog');

// @desc Get workout log for a specific date (YYYY-MM-DD)
// @route GET /api/workouts/date/:date
const getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const log = await WorkoutLog.findOne({ user: req.user._id, date });

    if (!log) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Save or update workout log for a date
// @route POST /api/workouts
const saveLog = async (req, res) => {
  try {
    const { date, title, durationMinutes, exercises, notes, completed } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    let log = await WorkoutLog.findOne({ user: req.user._id, date });

    if (log) {
      // Update existing
      log.title = title !== undefined ? title : log.title;
      log.durationMinutes = durationMinutes !== undefined ? durationMinutes : log.durationMinutes;
      log.exercises = exercises !== undefined ? exercises : log.exercises;
      log.notes = notes !== undefined ? notes : log.notes;
      log.completed = completed !== undefined ? completed : log.completed;
      await log.save();
    } else {
      // Create new
      log = await WorkoutLog.create({
        user: req.user._id,
        date,
        title: title || 'Daily Workout',
        durationMinutes: durationMinutes || 0,
        exercises: exercises || [],
        notes: notes || '',
        completed: completed || false,
      });
    }

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get workout logs within range or recent (e.g. last 30 logs)
// @route GET /api/workouts/recent
const getRecentLogs = async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const logs = await WorkoutLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get statistics, streak & PRs
// @route GET /api/workouts/stats
const getStats = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ date: -1 });

    const totalWorkouts = logs.length;
    const completedWorkouts = logs.filter((l) => l.completed).length;

    // Calculate total volume lifted & PRs
    let totalVolume = 0;
    const personalRecords = {}; // { 'Bench Press': { maxWeight: 100, reps: 5, date: '2026-10-25' } }

    logs.forEach((log) => {
      log.exercises.forEach((ex) => {
        const name = ex.name.trim();
        ex.sets.forEach((set) => {
          if (set.completed && set.weight > 0 && set.reps > 0) {
            const setVolume = set.weight * set.reps;
            totalVolume += setVolume;

            if (!personalRecords[name] || set.weight > personalRecords[name].maxWeight) {
              personalRecords[name] = {
                exerciseName: name,
                maxWeight: set.weight,
                reps: set.reps,
                date: log.date,
              };
            }
          }
        });
      });
    });

    // Calculate streak
    // Get unique dates where completed is true, sorted descending
    const completedDates = [
      ...new Set(
        logs
          .filter((l) => l.completed)
          .map((l) => l.date)
      ),
    ].sort((a, b) => (a < b ? 1 : -1));

    let currentStreak = 0;
    if (completedDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Check if user worked out today or yesterday to continue streak
      if (completedDates[0] === today || completedDates[0] === yesterday) {
        currentStreak = 1;
        let expectedDate = new Date(completedDates[0]);

        for (let i = 1; i < completedDates.length; i++) {
          expectedDate.setDate(expectedDate.getDate() - 1);
          const expectedDateStr = expectedDate.toISOString().split('T')[0];

          if (completedDates[i] === expectedDateStr) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalWorkouts,
        completedWorkouts,
        currentStreak,
        totalVolumeKg: Math.round(totalVolume),
        personalRecords: Object.values(personalRecords),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete workout log
// @route DELETE /api/workouts/:id
const deleteLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Workout log not found' });
    }

    await log.deleteOne();
    res.json({ success: true, message: 'Workout log deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLogByDate,
  saveLog,
  getRecentLogs,
  getStats,
  deleteLog,
};

