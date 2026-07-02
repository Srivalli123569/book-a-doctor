import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      const { data } = await api.get('/doctors', { params });
      setDoctors(data);
    } catch (err) {
      setError('Could not load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [search, specialization]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="page">
      <h1>Find a Doctor</h1>

      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All Specializations</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="General Physician">General Physician</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Orthopedic">Orthopedic</option>
        </select>
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {loading && <p>Loading doctors...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && doctors.length === 0 && <p>No doctors found matching your search.</p>}

      <div className="doctor-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
