import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
    const [reportData, setReportData] = useState({
        totalEmissions: 0,
        activities: [],
        loading: true,
        error: null
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/data`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });

            // Calculate total emissions
            const total = response.data.reduce((sum, item) => sum + Number(item.emissions), 0);

            setReportData({
                totalEmissions: total,
                activities: response.data,
                loading: false,
                error: null
            });
        } catch (err) {
            console.error('Error fetching report data:', err);
            setReportData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load report data'
            }));
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const handleDateChange = (e) => {
        setDateRange(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (reportData.loading) return <div>Loading report data...</div>;
    if (reportData.error) return <div className="error-message">{reportData.error}</div>;

    return (
        <div className="reports-container">
            <h2>Carbon Footprint Report</h2>
            
            <div className="date-filters">
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={dateRange.startDate}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={dateRange.endDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>

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
        </div>
    );
};

export default Reports;