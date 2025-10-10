const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  createEventSchema,
  updateEventSchema
} = require('../middleware/validation');

const {
  createEvent,
  getEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  getTimelineStats
} = require('../controllers/auditTimelineController');

// Apply authentication to all routes
router.use(authenticateToken);

// Audit Timeline Routes
router.post('/', requireRole(['admin', 'compliance_manager']), validateRequest(createEventSchema), createEvent);
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/stats', getTimelineStats);
router.put('/:id', validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', requireRole(['admin']), deleteEvent);

module.exports = router;
