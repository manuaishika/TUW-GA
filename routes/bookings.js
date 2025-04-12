const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Booking routes
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBooking);
router.put('/:id/faculty-approve', bookingController.facultyApprove);
router.put('/:id/admin-approve', bookingController.adminApprove);
router.put('/:id/reject', bookingController.rejectBooking);

module.exports = router; 