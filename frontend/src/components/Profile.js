import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // optional if you're using external CSS
import './Dashboard.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData(prevState => ({
                    ...prevState,
                    email: response.data.email
                }));
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const updateData = { email: formData.email };
            if (formData.password) updateData.password = formData.password;

            await axios.put(
                'http://localhost:5000/api/profile/update',
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prevState => ({
                ...prevState,
                password: '',
                confirmPassword: ''
            }));
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Error updating profile'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
           <nav className="navbar">
    <div className="navbar-container">
        <div className="logo">🌱 EcoTrack</div>
        <div className="nav-links">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/data-input" className="nav-link">Add Activity</a>
            <a href="/reports" className="nav-link">Reports</a>
            <a href="/profile" className="nav-link active">Profile</a>
            <button className="logout-btn" onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}>Logout</button>
        </div>
    </div>
</nav>


            <div className="profile-container">
                <h2>Update Profile</h2>
                {message.text && (
                    <div className={`alert ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password (optional)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Profile;
