const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const createNotification = require('./notificationHelper');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, reason } = req.body;

  if (!doctorId || !date || !timeSlot) {
    res.status(400);
    throw new Error('doctorId, date, and timeSlot are required');
  }

  const doctor = await Doctor.findById(doctorId).populate('user', 'name');
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Prevent double-booking the same doctor/date/time
  const clash = await Appointment.findOne({
    doctor: doctorId,
    date,
    timeSlot,
    status: { $in: ['pending', 'confirmed'] },
  });
  if (clash) {
    res.status(409);
    throw new Error('This time slot is already booked. Please choose another.');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date,
    timeSlot,
    reason,
  });

  await createNotification({
    user: doctor.user._id,
    title: 'New Appointment Request',
    message: `${req.user.name} requested an appointment on ${new Date(date).toDateString()} at ${timeSlot}.`,
    type: 'appointment',
    relatedAppointment: appointment._id,
  });

  res.status(201).json(appointment);
});

// @desc    Get appointments for the logged-in patient
// @route   GET /api/appointments/my
// @access  Private/Patient
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .sort({ date: -1 });
  res.json(appointments);
});

// @desc    Get appointments for the logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate('patient', 'name email phone')
    .sort({ date: -1 });
  res.json(appointments);
});

// @desc    Update appointment status (confirm/cancel/complete) + notes
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate('patient', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor || String(appointment.doctor) !== String(doctor._id)) {
    res.status(403);
    throw new Error('Not authorized to update this appointment');
  }

  if (status) appointment.status = status;
  if (notes !== undefined) appointment.notes = notes;
  await appointment.save();

  await createNotification({
    user: appointment.patient._id,
    title: 'Appointment Update',
    message: `Your appointment on ${appointment.date.toDateString()} is now "${appointment.status}".`,
    type: 'appointment',
    relatedAppointment: appointment._id,
  });

  res.json(appointment);
});

// @desc    Cancel own appointment (patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private/Patient
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (String(appointment.patient) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  appointment.status = 'cancelled';
  await appointment.save();
  res.json(appointment);
});

// @desc    Upload a document to an appointment (e.g. previous reports)
// @route   POST /api/appointments/:id/documents
// @access  Private/Patient
const uploadAppointmentDocument = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (String(appointment.patient) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to upload to this appointment');
  }
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  appointment.documents.push({
    fileName: req.file.originalname,
    filePath: `/uploads/${req.file.filename}`,
  });
  await appointment.save();

  res.status(201).json(appointment);
});

// @desc    Get all appointments (admin)
// @route   GET /api/appointments/admin/all
// @access  Private/Admin
const getAllAppointmentsAdmin = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('patient', 'name email')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .sort({ date: -1 });
  res.json(appointments);
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  uploadAppointmentDocument,
  getAllAppointmentsAdmin,
};
