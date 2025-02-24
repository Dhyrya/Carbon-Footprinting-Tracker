import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('Attempting login with:', { email }); // Debug log

            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            console.log('Login successful:', response.data); // Debug log

            // Store the token
            localStorage.setItem('token', response.data.token);
            
            // Clear form
            setEmail('');
            setPassword('');
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err.response?.data || err); // Debug log
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Carbon Footprint Tracker</h1>
                <h2>Track your carbon footprint</h2>
            </div>
            
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
            
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    className="login-button" 
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="signup-link">
                Don't have an account?
                <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;