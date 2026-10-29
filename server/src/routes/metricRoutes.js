const express = require('express');
const router = express.Router();
const {
  getMetrics,
  logMetric,
  deleteMetric,
} = require('../controllers/metricController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMetrics)
  .post(logMetric);

router.route('/:id')
  .delete(deleteMetric);

module.exports = router;

