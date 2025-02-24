import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DataInputForm from './components/DataInputForm';
import Reports from './components/Reports';
import Notifications from './components/Notifications';
import Profile from './components/Profile';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/data-input" element={
                        <PrivateRoute>
                            <DataInputForm />
                        </PrivateRoute>
                    } />
                    <Route path="/reports" element={
                        <PrivateRoute>
                            <Reports />
                        </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                        <PrivateRoute>
                            <Notifications />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;