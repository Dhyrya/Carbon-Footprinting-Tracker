import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Fetch current user data
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
            const updateData = {
                email: formData.email
            };
            
            // Only include password if it's been entered
            if (formData.password) {
                updateData.password = formData.password;
            }

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
        <div className="profile-container">
            <h2>Update Profile</h2>
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">New Password (optional)</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;