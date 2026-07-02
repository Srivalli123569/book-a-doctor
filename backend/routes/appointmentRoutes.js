const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  uploadAppointmentDocument,
  getAllAppointmentsAdmin,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);
router.put('/:id/cancel', protect, authorize('patient'), cancelAppointment);
router.post(
  '/:id/documents',
  protect,
  authorize('patient'),
  upload.single('document'),
  uploadAppointmentDocument
);
router.get('/admin/all', protect, authorize('admin'), getAllAppointmentsAdmin);

module.exports = router;
