const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors (browse/search)
// @route   GET /api/doctors?specialization=&search=
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { specialization, search } = req.query;

  const filter = { isApproved: true };
  if (specialization) filter.specialization = new RegExp(specialization, 'i');

  let doctors = await Doctor.find(filter).populate('user', 'name email avatar phone');

  if (search) {
    const term = search.toLowerCase();
    doctors = doctors.filter(
      (doc) =>
        doc.user.name.toLowerCase().includes(term) ||
        doc.specialization.toLowerCase().includes(term)
    );
  }

  res.json(doctors);
});

// @desc    Get single doctor's public profile
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email avatar phone');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  res.json(doctor);
});

// @desc    Update own doctor profile (specialization, fee, availability, bio)
// @route   PUT /api/doctors/me
// @access  Private/Doctor
const updateMyDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const fields = [
    'specialization',
    'qualifications',
    'experienceYears',
    'consultationFee',
    'bio',
    'clinicAddress',
    'availability',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) doctor[field] = req.body[field];
  });

  const updated = await doctor.save();
  res.json(updated);
});

// @desc    Get own doctor profile
// @route   GET /api/doctors/me
// @access  Private/Doctor
const getMyDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email avatar phone');
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }
  res.json(doctor);
});

// @desc    List all doctors, including unapproved (admin)
// @route   GET /api/doctors/admin/all
// @access  Private/Admin
const getAllDoctorsAdmin = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).populate('user', 'name email phone isActive');
  res.json(doctors);
});

// @desc    Approve or deactivate a doctor
// @route   PUT /api/doctors/admin/:id/approve
// @access  Private/Admin
const setDoctorApproval = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  doctor.isApproved = req.body.isApproved ?? true;
  await doctor.save();
  res.json(doctor);
});

module.exports = {
  getDoctors,
  getDoctorById,
  updateMyDoctorProfile,
  getMyDoctorProfile,
  getAllDoctorsAdmin,
  setDoctorApproval,
};
