import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './Navbar';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Common from './Common';
import Table from './Table';
import Image_upd from './Image_upd';

import Marksheet from './Marksheet';

import axios from '../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import  '../App.css'
import Footer from './Footer';
import GenTemplate from './GenTemplate';
import Student from './Student';
const App = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
          
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/auth/me'); 
                    setUser(res.data);
                    console.log(res.data)
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, []);


    const fetchUser = async () => {
          
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get('/auth/me'); 
                setUser(res.data);
                console.log(res.data)
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <Router>
           
            <div className="container mt-4 bod">
               
                <Routes>

                    <Route path="/" element={<> <NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Home user={user}/></>} />
                    <Route path="/login" element={ <Login  />} />
                    <Route path="/signup" element={<Signup />}  />
                    <Route path="/template" element={<><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Common user={user}/></>} />
                    <Route path="/marks/:t_nm" element={ <><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Table user={user}/></>} />
                    <Route path="/marksheets/:t_nm" element={<><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/> <Marksheet user={user}/> </>} />
                    <Route path="/images_update" element={<><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Image_upd user={user}/></>} />
                    <Route path="/GenTemplate" element={<><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><GenTemplate user={user}/></>} />
                    <Route path="/students/:temp_name" element={<><NavbarComponent user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Student user={user}/></>} />
                    
                </Routes>
             
            </div>
            <Footer/>
        </Router>
    );
};
// table compoonent paakanum


//first navbar,css sttyle,more fn(delete,update),pdf download alter pannanum.

export default App;

