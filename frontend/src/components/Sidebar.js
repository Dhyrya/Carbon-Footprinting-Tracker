import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Menu</h2>
            </div>
            <nav className="sidebar-nav">
                <Link 
                    to="/dashboard" 
                    className={location.pathname === '/dashboard' ? 'active' : ''}
                >
                    <i className="fas fa-tachometer-alt"></i>
                    Dashboard
                </Link>
                <Link 
                    to="/data-input" 
                    className={location.pathname === '/data-input' ? 'active' : ''}
                >
                    <i className="fas fa-edit"></i>
                    Input Data
                </Link>
                <Link 
                    to="/reports" 
                    className={location.pathname === '/reports' ? 'active' : ''}
                >
                    <i className="fas fa-chart-bar"></i>
                    Reports
                </Link>
                <Link 
                    to="/notifications" 
                    className={location.pathname === '/notifications' ? 'active' : ''}
                >
                    <i className="fas fa-bell"></i>
                    Notifications
                </Link>
                <Link 
                    to="/profile" 
                    className={location.pathname === '/profile' ? 'active' : ''}
                >
                    <i className="fas fa-user"></i>
                    Profile
                </Link>
                
            </nav>
        </div>
    );
};

export default Sidebar; 