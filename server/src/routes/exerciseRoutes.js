const express = require('express');
const router = express.Router();
const {
  getExercises,
  createCustomExercise,
  deleteCustomExercise,
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getExercises)
  .post(createCustomExercise);

router.route('/:id')
  .delete(deleteCustomExercise);

module.exports = router;

