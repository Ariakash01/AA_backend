import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProfile = ({ user,fetchUser }) => {
    const [profile, setProfile] = useState({
        name: user.name,
        email: user.email,
        dept: user.dept || 'N/A',
        role: user.role || 'Admin',
    });
    const [originalProfile, setOriginalProfile] = useState(profile);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes and detect changes
    const handleChange = (field, value) => {
        const updatedProfile = { ...profile, [field]: value };
        setProfile(updatedProfile);
        setIsChanged(JSON.stringify(updatedProfile) !== JSON.stringify(originalProfile));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/auth/admin/update/profile/${user._id}`, profile);
            setOriginalProfile(response.data);
            fetchUser()
            setSuccess('Profile updated successfully!');
            setIsChanged(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4 gr">
                <h2 className="text-center mb-4" style={{ color: '#343a40' }}>
                    Update Profile
                </h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={profile.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={profile.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Department</label>
                        <input
                            type="text"
                            className="form-control"
                            value={profile.dept}
                            onChange={(e) => handleChange('dept', e.target.value)}
                        />
                    </div>
                  
                    <div className="text-center">
                        <button
                            type="button"
                            className={`btn btn-${isChanged ? 'primary' : 'secondary'}`}
                            onClick={handleSave}
                            disabled={!isChanged}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
