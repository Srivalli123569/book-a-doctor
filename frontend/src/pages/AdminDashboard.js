import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('doctors');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsRes, apptRes] = await Promise.all([
        api.get('/doctors/admin/all'),
        api.get('/appointments/admin/all'),
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(apptRes.data);
    } catch (err) {
      setError('Could not load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleApproval = async (doctor) => {
    try {
      await api.put(`/doctors/admin/${doctor._id}/approve`, { isApproved: !doctor.isApproved });
      fetchData();
    } catch (err) {
      setError('Failed to update doctor approval.');
    }
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button className={`tab ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}>
          Doctors ({doctors.length})
        </button>
        <button
          className={`tab ${tab === 'appointments' ? 'active' : ''}`}
          onClick={() => setTab('appointments')}
        >
          Appointments ({appointments.length})
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {tab === 'doctors' && !loading && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.user?.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.user?.email}</td>
                <td>
                  <span className={`badge ${doc.isApproved ? 'badge-confirmed' : 'badge-pending'}`}>
                    {doc.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => toggleApproval(doc)}>
                    {doc.isApproved ? 'Revoke' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'appointments' && !loading && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.patient?.name}</td>
                <td>{appt.doctor?.user?.name}</td>
                <td>{new Date(appt.date).toDateString()}</td>
                <td>{appt.timeSlot}</td>
                <td>
                  <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
