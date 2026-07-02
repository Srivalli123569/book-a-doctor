import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = [
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '11:00 - 11:30',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
];

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [booking, setBooking] = useState({ date: '', timeSlot: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        setError('Doctor not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBookingChange = (e) => setBooking({ ...booking, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      setError('Only patients can book appointments.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId: id,
        date: booking.date,
        timeSlot: booking.timeSlot,
        reason: booking.reason,
      });
      setSuccess('Appointment requested! You can track its status in your dashboard.');
      setBooking({ date: '', timeSlot: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error && !doctor) return <div className="page alert alert-error">{error}</div>;

  return (
    <div className="page">
      <div className="doctor-profile">
        <div className="doctor-profile-header">
          <div className="doctor-card-avatar large">{doctor.user?.name?.charAt(0)}</div>
          <div>
            <h1>{doctor.user?.name}</h1>
            <p className="doctor-specialization">{doctor.specialization}</p>
            <p>{doctor.qualifications}</p>
            <p>
              {doctor.experienceYears} years of experience &middot; Consultation fee: ₹
              {doctor.consultationFee}
            </p>
            {doctor.clinicAddress && <p>📍 {doctor.clinicAddress}</p>}
          </div>
        </div>

        {doctor.bio && (
          <section className="doctor-bio">
            <h3>About</h3>
            <p>{doctor.bio}</p>
          </section>
        )}

        {doctor.availability?.length > 0 && (
          <section>
            <h3>Weekly Availability</h3>
            <ul className="availability-list">
              {doctor.availability.map((slot, idx) => (
                <li key={idx}>
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="booking-section">
          <h3>Book an Appointment</h3>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form className="booking-form" onSubmit={handleBookingSubmit}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={booking.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleBookingChange}
              required
            />

            <label>Time Slot</label>
            <select name="timeSlot" value={booking.timeSlot} onChange={handleBookingChange} required>
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <label>Reason for visit</label>
            <textarea
              name="reason"
              value={booking.reason}
              onChange={handleBookingChange}
              placeholder="Briefly describe your symptoms or reason for the visit"
              rows={3}
            />

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Booking...' : 'Request Appointment'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
