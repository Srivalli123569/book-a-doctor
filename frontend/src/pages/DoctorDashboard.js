import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notesDraft, setNotesDraft] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, profileRes] = await Promise.all([
        api.get('/appointments/doctor'),
        api.get('/doctors/me'),
      ]);
      setAppointments(apptRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status, notes: notesDraft[id] });
      fetchData();
    } catch (err) {
      setError('Failed to update appointment.');
    }
  };

  return (
    <div className="page">
      <h1>Doctor Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p>Loading...</p>}

      {profile && (
        <div className="profile-summary">
          <p>
            <strong>{profile.user?.name}</strong> &middot; {profile.specialization}
          </p>
          <p>
            Status:{' '}
            {profile.isApproved ? (
              <span className="badge badge-confirmed">Approved</span>
            ) : (
              <span className="badge badge-pending">Pending Admin Approval</span>
            )}
          </p>
        </div>
      )}

      <h2>Appointment Requests</h2>
      {!loading && appointments.length === 0 && <p>No appointments yet.</p>}

      <div className="appointment-list">
        {appointments.map((appt) => (
          <div key={appt._id} className="appointment-card">
            <div className="appointment-card-header">
              <h3>{appt.patient?.name}</h3>
              <span className={`badge ${statusColors[appt.status]}`}>{appt.status}</span>
            </div>
            <p>
              📅 {new Date(appt.date).toDateString()} &middot; 🕐 {appt.timeSlot}
            </p>
            {appt.reason && <p>Reason: {appt.reason}</p>}
            <p>Contact: {appt.patient?.email} {appt.patient?.phone && `· ${appt.patient.phone}`}</p>

            {appt.documents?.length > 0 && (
              <div className="documents-list">
                <strong>Patient Documents:</strong>
                <ul>
                  {appt.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a href={`http://localhost:5000${doc.filePath}`} target="_blank" rel="noreferrer">
                        {doc.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <textarea
              placeholder="Add consultation notes..."
              rows={2}
              value={notesDraft[appt._id] ?? appt.notes ?? ''}
              onChange={(e) => setNotesDraft({ ...notesDraft, [appt._id]: e.target.value })}
            />

            <div className="appointment-actions">
              {appt.status === 'pending' && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(appt._id, 'confirmed')}>
                    Confirm
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(appt._id, 'cancelled')}>
                    Decline
                  </button>
                </>
              )}
              {appt.status === 'confirmed' && (
                <button className="btn btn-primary btn-sm" onClick={() => updateStatus(appt._id, 'completed')}>
                  Mark Completed
                </button>
              )}
              {(appt.status === 'pending' || appt.status === 'confirmed') && notesDraft[appt._id] !== undefined && (
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(appt._id, appt.status)}>
                  Save Notes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
