import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdvisorManagement = ({user}) => {
    const [advisors, setAdvisors] = useState([]);
    const [error, setError] = useState('');

    // Fetch advisors on component load
    useEffect(() => {
        fetchAdvisors();
    }, []);

    const fetchAdvisors = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/advisors/${user._id}`);
            setAdvisors(response.data);
        } catch (err) {
            setError('Failed to fetch advisors.');
        }
    };

    const handleEdit = async (id, field, value) => {
        try {
            await axios.put(`http://localhost:5000/api/auth/advisors_upd/${id}`, { [field]: value });
            setAdvisors(prev =>
                prev.map(advisor =>
                    advisor._id === id ? { ...advisor, [field]: value } : advisor
                )
            );
        } catch (err) {
            console.error('Error updating advisor:', err);
            setError('Failed to update advisor.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/auth/advisors_del/${id}`);
            setAdvisors(prev => prev.filter(advisor => advisor._id !== id));
        } catch (err) {
            console.error('Error deleting advisor:', err);
            setError('Failed to delete advisor.');
        }
    };

    return (
        <div>
            <h1>Advisor Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {advisors.map(advisor => (
                    <div
                        key={advisor._id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            margin: '10px',
                            width: '200px',
                            borderRadius: '8px',
                            position: 'relative',
                        }}
                    >
                        <input
                            type="text"
                            defaultValue={advisor.name}
                            onBlur={(e) =>
                                handleEdit(advisor._id, 'name', e.target.value)
                            }
                            style={{ width: '100%', marginBottom: '5px' }}
                        />
                        <input
                            type="email"
                            defaultValue={advisor.email}
                            onBlur={(e) =>
                                handleEdit(advisor._id, 'email', e.target.value)
                            }
                            style={{ width: '100%', marginBottom: '5px' }}
                        />
                        <button
                            onClick={() => handleDelete(advisor._id)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                color: 'red',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            &#10005;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdvisorManagement;
