import React, { useState } from 'react';
import axios from 'axios';
import './DataInputForm.css';

const DataInputForm = ({ onDataAdded }) => {
    const [formData, setFormData] = useState({
        type: 'transportation',
        emissions: '',
        details: {
            description: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in again');
                return;
            }

            // Log the request details
            console.log('Sending request with token:', token);
            console.log('Form data:', formData);

            const response = await axios.post(
                'http://localhost:5000/api/data/add',
                {
                    type: formData.type,
                    emissions: parseFloat(formData.emissions),
                    details: {
                        description: formData.details.description
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Log the response
            console.log('Server response:', response.data);

            setSuccess('Data added successfully!');
            // Reset form
            setFormData({
                type: 'transportation',
                emissions: '',
                details: {
                    description: ''
                }
            });

            // Trigger parent component update if provided
            if (onDataAdded) {
                onDataAdded();
            }

        } catch (err) {
            console.error('Full error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error adding data';
            setError(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-input-form">
            <h2>Add Carbon Footprint Data</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                    <button 
                        className="close-button"
                        onClick={() => setError('')}
                    >
                        ×
                    </button>
                </div>
            )}
            
            {success && (
                <div className="success-message">
                    {success}
                    <button 
                        className="close-button"
                        onClick={() => setSuccess('')}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="type">Activity Type</label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({
                            ...formData,
                            type: e.target.value
                        })}
                        required
                    >
                        <option value="transportation">Transportation</option>
                        <option value="electricity">Electricity</option>
                        <option value="food">Food</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="emissions">Emissions (kg CO2)</label>
                    <input
                        type="number"
                        id="emissions"
                        value={formData.emissions}
                        onChange={(e) => setFormData({
                            ...formData,
                            emissions: e.target.value
                        })}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter amount in kg"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        value={formData.details.description}
                        onChange={(e) => setFormData({
                            ...formData,
                            details: {
                                ...formData.details,
                                description: e.target.value
                            }
                        })}
                        placeholder="Describe your activity"
                        rows="3"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={loading ? 'button-loading' : ''}
                >
                    {loading ? 'Adding...' : 'Add Data'}
                </button>
            </form>
        </div>
    );
};

export default DataInputForm;