// Run with: npm run seed
// Populates the database with a demo admin, a few doctors, and a patient.
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing demo data...');
  await User.deleteMany({});
  await Doctor.deleteMany({});

  console.log('Creating admin...');
  await User.create({
    name: 'Admin User',
    email: 'admin@bookadoctor.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('Creating patient...');
  await User.create({
    name: 'John Patient',
    email: 'patient@bookadoctor.com',
    password: 'patient123',
    role: 'patient',
    phone: '9999999999',
  });

  console.log('Creating doctors...');
  const doctorSeeds = [
    {
      name: 'Dr. Aisha Khan',
      email: 'aisha.khan@bookadoctor.com',
      specialization: 'Cardiologist',
      qualifications: 'MBBS, MD (Cardiology)',
      experienceYears: 12,
      consultationFee: 800,
      bio: 'Specialist in interventional cardiology with 12 years of clinical experience.',
      clinicAddress: '221B Heart Lane, Springfield',
    },
    {
      name: 'Dr. Ravi Sharma',
      email: 'ravi.sharma@bookadoctor.com',
      specialization: 'Dermatologist',
      qualifications: 'MBBS, MD (Dermatology)',
      experienceYears: 8,
      consultationFee: 600,
      bio: 'Focused on skin health, cosmetic dermatology, and allergy management.',
      clinicAddress: '45 Skin Care Ave, Springfield',
    },
    {
      name: 'Dr. Emily Chen',
      email: 'emily.chen@bookadoctor.com',
      specialization: 'Pediatrician',
      qualifications: 'MBBS, DCH',
      experienceYears: 10,
      consultationFee: 500,
      bio: 'Passionate about child healthcare and developmental pediatrics.',
      clinicAddress: '9 Kids Health Blvd, Springfield',
    },
  ];

  for (const seedDoc of doctorSeeds) {
    const user = await User.create({
      name: seedDoc.name,
      email: seedDoc.email,
      password: 'doctor123',
      role: 'doctor',
      phone: '8888888888',
    });

    await Doctor.create({
      user: user._id,
      specialization: seedDoc.specialization,
      qualifications: seedDoc.qualifications,
      experienceYears: seedDoc.experienceYears,
      consultationFee: seedDoc.consultationFee,
      bio: seedDoc.bio,
      clinicAddress: seedDoc.clinicAddress,
      isApproved: true,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '13:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '13:00' },
        { day: 'Friday', startTime: '14:00', endTime: '18:00' },
      ],
    });
  }

  console.log('Seed complete!');
  console.log('Login with: admin@bookadoctor.com / admin123');
  console.log('           patient@bookadoctor.com / patient123');
  console.log('           aisha.khan@bookadoctor.com / doctor123 (and other doctors)');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
