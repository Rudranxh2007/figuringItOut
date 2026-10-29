const Exercise = require('../models/Exercise');

// @desc Get all exercises (pre-built + user's custom)
// @route GET /api/exercises
const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      $or: [{ user: null }, { user: req.user._id }],
    }).sort({ muscleGroup: 1, name: 1 });

    res.json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create custom exercise
// @route POST /api/exercises
const createCustomExercise = async (req, res) => {
  try {
    const { name, muscleGroup, equipment, description, gifUrl } = req.body;

    if (!name || !muscleGroup) {
      return res.status(400).json({ success: false, message: 'Please provide exercise name and muscle group' });
    }

    const exercise = await Exercise.create({
      name,
      muscleGroup,
      equipment: equipment || 'Other',
      description: description || '',
      gifUrl: gifUrl || '',
      isCustom: true,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete custom exercise
// @route DELETE /api/exercises/:id
const deleteCustomExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Custom exercise not found or not owned by you' });
    }

    await exercise.deleteOne();
    res.json({ success: true, message: 'Exercise removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExercises,
  createCustomExercise,
  deleteCustomExercise,
};

