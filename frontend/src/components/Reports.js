import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [dateRange, setDateRange] = useState({
        startDate: today,
        endDate: today,
    });

    const [reportData, setReportData] = useState({
        totalEmissions: 0,
        activities: [],
        loading: false,
        error: null,
    });

    const fetchReportData = async () => {
        setReportData(prev => ({ ...prev, loading: true }));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/data`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });

            const filteredData = response.data.filter(activity => {
                const activityDate = new Date(activity.date).toISOString().split('T')[0];
                return activityDate >= dateRange.startDate && activityDate <= dateRange.endDate;
            });

            const total = filteredData.reduce((sum, item) => sum + Number(item.emissions), 0);

            setReportData({
                totalEmissions: total,
                activities: filteredData,
                loading: false,
                error: null
            });
        } catch (err) {
            setReportData({
                totalEmissions: 0,
                activities: [],
                loading: false,
                error: 'Failed to load report data'
            });
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="reports-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    <span role="img" aria-label="leaf">🌱</span> <span className="brand">EcoTrack</span>
                </div>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/input">Input Data</Link>
                    <Link to="/reports" className="active">Reports</Link>
                    <Link to="/profile">Profile</Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="reports-container">
                <h2>Carbon Footprint Report</h2>

                <div className="date-filters">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                {reportData.loading ? (
                    <p>Loading report data...</p>
                ) : reportData.error ? (
                    <div className="error-message">{reportData.error}</div>
                ) : (
                    <>
                        <div className="report-summary">
                            <div className="summary-card">
                                <h3>Total Emissions</h3>
                                <p className="total-emissions">{reportData.totalEmissions.toFixed(2)} kg CO2</p>
                                <p className="period">
                                    Period: {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="activities-list">
                            <h3>Detailed Activities</h3>
                            {reportData.activities.length === 0 ? (
                                <p>No activities recorded for this period</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Emissions (kg CO2)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.activities.map((activity, index) => (
                                            <tr key={index}>
                                                <td>{new Date(activity.date).toLocaleDateString()}</td>
                                                <td>{activity.type}</td>
                                                <td>{activity.details?.description || '-'}</td>
                                                <td>{activity.emissions.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
