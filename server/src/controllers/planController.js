const WorkoutPlan = require('../models/WorkoutPlan');

// @desc Get user's workout routine plans
// @route GET /api/plans
const getPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new workout routine plan
// @route POST /api/plans
const createPlan = async (req, res) => {
  try {
    const { title, description, dayOfWeek, exercises } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Plan title is required' });
    }

    const plan = await WorkoutPlan.create({
      user: req.user._id,
      title,
      description: description || '',
      dayOfWeek: dayOfWeek || [],
      exercises: exercises || [],
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update workout routine plan
// @route PUT /api/plans/:id
const updatePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const { title, description, dayOfWeek, exercises } = req.body;
    if (title) plan.title = title;
    if (description !== undefined) plan.description = description;
    if (dayOfWeek) plan.dayOfWeek = dayOfWeek;
    if (exercises) plan.exercises = exercises;

    await plan.save();
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete workout routine plan
// @route DELETE /api/plans/:id
const deletePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await plan.deleteOne();
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};

