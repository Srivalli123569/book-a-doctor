const express = require('express');
const {
  getDoctors,
  getDoctorById,
  updateMyDoctorProfile,
  getMyDoctorProfile,
  getAllDoctorsAdmin,
  setDoctorApproval,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getDoctors);

// Doctor self-service (must come before /:id to avoid route collision)
router.get('/me', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/me', protect, authorize('doctor'), updateMyDoctorProfile);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllDoctorsAdmin);
router.put('/admin/:id/approve', protect, authorize('admin'), setDoctorApproval);

// Public (keep last so it doesn't shadow the routes above)
router.get('/:id', getDoctorById);

module.exports = router;
