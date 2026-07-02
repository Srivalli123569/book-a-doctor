import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'doctor' ? '/doctor' : '/patient';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🩺 Book a Doctor
      </Link>
      <div className="navbar-links">
        <Link to="/doctors">Find Doctors</Link>
        {user ? (
          <>
            <Link to={dashboardPath}>Dashboard</Link>
            <Link to="/notifications">Notifications</Link>
            <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
