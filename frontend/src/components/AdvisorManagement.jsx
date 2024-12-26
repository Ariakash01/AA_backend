import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdvisorManagement = ({ user }) => {
    const [advisors, setAdvisors] = useState([]);
    const [error, setError] = useState('');
    const [editStates, setEditStates] = useState({}); // Tracks changes for each advisor

    // Fetch advisors on component load
    useEffect(() => {
        fetchAdvisors();
    }, []);

    const fetchAdvisors = async () => {
        try {
            const response = await axios.get(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/auth/advisors/${user._id}`);
            setAdvisors(response.data);
            const initialStates = response.data.reduce((acc, advisor) => {
                acc[advisor._id] = { hasChanges: false, updatedFields: {} };
                return acc;
            }, {});
            setEditStates(initialStates);
        } catch (err) {
            setError('Failed to fetch advisors.');
        }
    };

    const handleFieldChange = (id, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: {
                hasChanges: true,
                updatedFields: { ...prev[id].updatedFields, [field]: value },
            },
        }));
    };

    const handleSave = async (id) => {
        const { updatedFields } = editStates[id];
        try {
            await axios.put(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/auth/advisors_upd/${id}`, updatedFields);
            setAdvisors((prev) =>
                prev.map((advisor) =>
                    advisor._id === id ? { ...advisor, ...updatedFields } : advisor
                )
            );
            setEditStates((prev) => ({
                ...prev,
                [id]: { hasChanges: false, updatedFields: {} },
            }));
        } catch (err) {
            console.error('Error updating advisor:', err);
            setError('Failed to update advisor.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/auth/advisors_del/${id}`);
            setAdvisors((prev) => prev.filter((advisor) => advisor._id !== id));
            setEditStates((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        } catch (err) {
            console.error('Error deleting advisor:', err);
            setError('Failed to delete advisor.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Advisor Management</h2>
            <p className="my-4">{advisors.length} Advisor(s) Found</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="row">
                {advisors.map((advisor) => (
                    <div key={advisor._id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <input
                                        type="text"
                                        defaultValue={advisor.name}
                                        onChange={(e) =>
                                            handleFieldChange(advisor._id, 'name', e.target.value)
                                        }
                                        className="form-control border-0 bg-light mb-2"
                                    />
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    <input
                                        type="text"
                                        defaultValue={advisor.dept || 'N/A'}
                                        onChange={(e) =>
                                            handleFieldChange(advisor._id, 'dept', e.target.value)
                                        }
                                        className="form-control border-0 bg-light mb-2"
                                    />
                                </h6>
                                <p className="card-text">
                                    <input
                                        type="email"
                                        defaultValue={advisor.email}
                                        onChange={(e) =>
                                            handleFieldChange(advisor._id, 'email', e.target.value)
                                        }
                                        className="form-control border-0 bg-light"
                                    />
                                </p>
                                <p className="card-text bl ">Role: Advisor</p>

                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        onClick={() => handleSave(advisor._id)}
                                        className="btn btn-primary btn-sm"
                                        disabled={!editStates[advisor._id]?.hasChanges}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => handleDelete(advisor._id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdvisorManagement;
