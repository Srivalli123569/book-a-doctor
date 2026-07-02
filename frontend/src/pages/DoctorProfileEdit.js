import { useEffect, useState } from 'react';
import api from '../api/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorProfileEdit() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/doctors/me');
        setForm({
          specialization: data.specialization || '',
          qualifications: data.qualifications || '',
          experienceYears: data.experienceYears || 0,
          consultationFee: data.consultationFee || 0,
          bio: data.bio || '',
          clinicAddress: data.clinicAddress || '',
          availability: data.availability?.length
            ? data.availability
            : [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
        });
      } catch (err) {
        setError('Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSlotChange = (idx, field, value) => {
    const updated = [...form.availability];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, availability: updated });
  };

  const addSlot = () =>
    setForm({
      ...form,
      availability: [...form.availability, { day: 'Monday', startTime: '09:00', endTime: '17:00' }],
    });

  const removeSlot = (idx) =>
    setForm({ ...form, availability: form.availability.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/doctors/me', form);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (!form) return <div className="page alert alert-error">{error}</div>;

  return (
    <div className="page">
      <h1>Edit Doctor Profile</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Specialization</label>
        <input name="specialization" value={form.specialization} onChange={handleChange} required />

        <label>Qualifications</label>
        <input name="qualifications" value={form.qualifications} onChange={handleChange} />

        <label>Years of Experience</label>
        <input
          type="number"
          name="experienceYears"
          value={form.experienceYears}
          onChange={handleChange}
          min={0}
        />

        <label>Consultation Fee (₹)</label>
        <input
          type="number"
          name="consultationFee"
          value={form.consultationFee}
          onChange={handleChange}
          min={0}
        />

        <label>Clinic Address</label>
        <input name="clinicAddress" value={form.clinicAddress} onChange={handleChange} />

        <label>Bio</label>
        <textarea name="bio" rows={4} value={form.bio} onChange={handleChange} />

        <label>Weekly Availability</label>
        {form.availability.map((slot, idx) => (
          <div className="availability-row" key={idx}>
            <select value={slot.day} onChange={(e) => handleSlotChange(idx, 'day', e.target.value)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleSlotChange(idx, 'startTime', e.target.value)}
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleSlotChange(idx, 'endTime', e.target.value)}
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSlot(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addSlot}>
          + Add Slot
        </button>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
