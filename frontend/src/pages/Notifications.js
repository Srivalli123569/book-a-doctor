import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      setError('Could not load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      // silently ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      // silently ignore
    }
  };

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && notifications.length === 0 && <p>You have no notifications.</p>}

      <div className="notification-list">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-card ${n.isRead ? '' : 'unread'}`}
            onClick={() => !n.isRead && markAsRead(n._id)}
          >
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
