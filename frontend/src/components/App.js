// frontend/src/components/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavbarComponent from './Navbar';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Common from './Common';
import Table from './Table';
import Marks from './Marks';
import Marksheet from './Marksheet';
import MarksheetView from './MarksheetView';
import axios from '../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/auth/me'); // You need to create this endpoint
                    setUser(res.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <Router>
           
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<> <NavbarComponent user={user} handleLogout={handleLogout} /><Home /></>} />
                    <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} />
                    <Route path="/template" element={user ?<><NavbarComponent user={user} handleLogout={handleLogout} /><Common /></>  : <Navigate to="/login" />} />
                    <Route path="/marks" element={user ? <><NavbarComponent user={user} handleLogout={handleLogout} /><Table /></> : <Navigate to="/login" />} />
                    <Route path="/marksheets" element={user ?<><NavbarComponent user={user} handleLogout={handleLogout} /> <Marksheet /> </>: <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};
// table compoonent paakanum
export default App;
