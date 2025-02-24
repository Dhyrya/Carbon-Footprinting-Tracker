import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard">
                    <span className="brand-icon">🌱</span>
                    Carbon Tracker
                </Link>
            </div>

            <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link 
                    to="/dashboard" 
                    className={isActive('/dashboard') ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-chart-line"></i>
                    Dashboard
                </Link>
                <Link 
                    to="/data-input" 
                    className={isActive('/data-input') ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-input"></i>
                    Input Data
                </Link>
                <Link 
                    to="/reports" 
                    className={isActive('/reports') ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-file-alt"></i>
                    Reports
                </Link>
                <Link 
                    to="/notifications" 
                    className={isActive('/notifications') ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-bell"></i>
                    Notifications
                </Link>
                <Link 
                    to="/profile" 
                    className={isActive('/profile') ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-user"></i>
                    Profile
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navigation; 