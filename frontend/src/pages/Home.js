import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Find the right doctor, book in minutes.</h1>
        <p>
          Browse trusted healthcare providers, check availability, and schedule appointments
          online — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/doctors" className="btn btn-primary btn-lg">
            Browse Doctors
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🔍 Doctor Browsing</h3>
          <p>Search by specialization and compare experience, fees, and availability.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Easy Scheduling</h3>
          <p>Book, reschedule, or cancel appointments with just a few clicks.</p>
        </div>
        <div className="feature-card">
          <h3>📁 Secure Documents</h3>
          <p>Upload medical reports and prescriptions securely for your appointments.</p>
        </div>
        <div className="feature-card">
          <h3>🔔 Notifications</h3>
          <p>Stay updated on appointment confirmations, reminders, and changes.</p>
        </div>
      </section>
    </div>
  );
}
