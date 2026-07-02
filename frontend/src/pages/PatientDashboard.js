import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (err) {
      setError('Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      setError('Failed to cancel appointment.');
    }
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    setMessage('');
    const formData = new FormData();
    formData.append('document', file);
    try {
      await api.post(`/appointments/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Document uploaded successfully.');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="page">
      <h1>My Appointments</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {loading && <p>Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p>
          You have no appointments yet. <a href="/doctors">Browse doctors</a> to book one.
        </p>
      )}

      <div className="appointment-list">
        {appointments.map((appt) => (
          <div key={appt._id} className="appointment-card">
            <div className="appointment-card-header">
              <h3>{appt.doctor?.user?.name}</h3>
              <span className={`badge ${statusColors[appt.status]}`}>{appt.status}</span>
            </div>
            <p>{appt.doctor?.specialization}</p>
            <p>
              📅 {new Date(appt.date).toDateString()} &middot; 🕐 {appt.timeSlot}
            </p>
            {appt.reason && <p>Reason: {appt.reason}</p>}
            {appt.notes && <p className="doctor-notes">Doctor's notes: {appt.notes}</p>}

            {appt.documents?.length > 0 && (
              <div className="documents-list">
                <strong>Documents:</strong>
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

            <div className="appointment-actions">
              {(appt.status === 'pending' || appt.status === 'confirmed') && (
                <>
                  <label className="btn btn-outline btn-sm file-upload-btn">
                    {uploadingId === appt._id ? 'Uploading...' : 'Upload Document'}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileUpload(appt._id, e.target.files[0])}
                    />
                  </label>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(appt._id)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
