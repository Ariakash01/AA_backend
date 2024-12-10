import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');

    // Fetch admins on component load
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/admins');
            setAdmins(response.data);
        } catch (err) {
            setError('Failed to fetch admins.');
        }
    };

   

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin Management</h2>
            <p className="my-4">{admins.length} Admin(s) Found</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="row">
                {admins.map((admin) => (
                    <div key={admin._id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{admin.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{admin.email}</h6>
                                <h6 className="card-subtitle mb-2 text-muted">{admin.dept}</h6>

                                <p className="card-text gr">Role: Admin</p>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
