import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card-avatar">{doctor.user?.name?.charAt(0) || 'D'}</div>
      <div className="doctor-card-body">
        <h3>{doctor.user?.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>
        <p className="doctor-meta">
          {doctor.experienceYears} yrs experience &middot; ₹{doctor.consultationFee} fee
        </p>
        {doctor.rating > 0 && <p className="doctor-rating">⭐ {doctor.rating.toFixed(1)}</p>}
        <Link to={`/doctors/${doctor._id}`} className="btn btn-primary btn-sm">
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}
