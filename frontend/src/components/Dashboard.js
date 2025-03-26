import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS styles

const Dashboard = () => {
    const [userData, setUserData] = useState({
        totalEmissions: 0,
        recentActivities: [],
        loading: true,
        error: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserData({
                    ...response.data,
                    loading: false
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setUserData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load dashboard data'
                }));
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (userData.loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (userData.error) {
        return <div className="error-message">{userData.error}</div>;
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">🌱 EcoTrack</div>
                    <div className="nav-links">
                        <a href="/dashboard" className="nav-link active">Dashboard</a>
                        <a href="/data-input" className="nav-link">Add Activity</a>
                        <a href="/reports" className="nav-link">Reports</a>
                        <a href="/profile" className="nav-link">Profile</a>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Welcome to Your Dashboard</h1>
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-summary">
                        <div className="summary-card">
                            <h3>Total Carbon Footprint</h3>
                            <p className="emission-value">{userData.totalEmissions.toFixed(2)} kg CO2</p>
                        </div>
                    </div>

                    <div className="recent-activities">
                        <h3>Recent Activities</h3>
                        {userData.recentActivities.length === 0 ? (
                            <p>No recent activities recorded</p>
                        ) : (
                            <ul className="activities-list">
                                {userData.recentActivities.map((activity, index) => (
                                    <li key={index} className="activity-item">
                                        <span className="activity-date">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </span>
                                        <span className="activity-type">{activity.type}</span>
                                        <span className="activity-emissions">
                                            {activity.emissions.toFixed(2)} kg CO2
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
