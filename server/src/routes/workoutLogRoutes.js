const express = require('express');
const router = express.Router();
const {
  getLogByDate,
  saveLog,
  getRecentLogs,
  getStats,
  deleteLog,
} = require('../controllers/workoutLogController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getStats);
router.get('/recent', getRecentLogs);
router.get('/date/:date', getLogByDate);
router.post('/', saveLog);
router.delete('/:id', deleteLog);

module.exports = router;

