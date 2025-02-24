import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch notifications');
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/notifications/${notificationId}`,
                { read: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(notifications.map(notif => 
                notif.id === notificationId ? {...notif, read: true} : notif
            ));
        } catch (err) {
            setError('Failed to update notification');
        }
    };

    if (loading) return <div className="loading">Loading notifications...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Notifications</h1>
                <p className="page-subtitle">Stay updated with your carbon footprint alerts</p>
            </div>

            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-bell-slash"></i>
                        <p>No notifications available</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                        >
                            <div className="notification-icon">
                                <i className={`fas fa-${notification.type === 'alert' ? 'exclamation-circle' : 'info-circle'}`}></i>
                            </div>
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-date">
                                    {new Date(notification.date).toLocaleDateString()}
                                </span>
                            </div>
                            {!notification.read && (
                                <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="mark-read-btn"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;