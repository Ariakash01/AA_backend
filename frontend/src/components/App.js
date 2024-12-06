import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './Navbar';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Common from './Common';
import Table from './Table';
import Image_upd from './Image_upd';
import  Analyze from './Analyze';

import Marksheet from './Marksheet';

import axios from '../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import  '../App.css'
import Footer from './Footer';
import GenTemplate from './GenTemplate';
import Student from './Student';
const App = () => {
    const [user, setUser] = useState(null);
    const [reload, setReload] = useState(false);





    const [templates, setTemplates] = useState([]);
    const [name, setName] = useState([]);
    const [marksheetData, setMarksheetData] = useState({});
    const [loading, setLoading] = useState(true);



 
useEffect(()=>{
    rel();
},[user])


   const rel=() => {
        const fetchTemplates = async () => {
            if (user) {
                try {
                    const res = await axios.get(
                        `https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/marksheets/ms/${user._id}`
                    );
                    setTemplates(res.data);

                    const uniqueNames = new Set();
                    res.data.forEach((marksheet) => uniqueNames.add(marksheet.testName));
                    const uniqueNameArray = Array.from(uniqueNames);
                    setName(uniqueNameArray);
                } catch (error) {
                    console.error('Error fetching templates:', error);
                }
            }
        };

        const fetchMarksheetsByTemplates = async () => {
            const tempData = {};

            for (const t_nm of name) {
                try {
                    const res = await axios.get(`/marksheets/marksheet/${t_nm}/${user._id}`);
                    const marksheets = res.data;

                    // Calculate pass and fail
                    let totalPass = 0;
                    let totalFail = 0;
                    const subjectWise = {};

                    marksheets.forEach((marksheet) => {
                        
                        if (marksheet.status === 'Pass') {
                            totalPass += 1;
                           
                        } else {
                            totalFail += 1;
                        
                        }
                        marksheet.subjects.forEach((subject) => {
                            if (!subjectWise[subject.name]) {
                                subjectWise[subject.name] = { pass: 0, fail: 0 };
                            }

                            if (marksheet.status === 'Pass') {
                              
                                subjectWise[subject.name].pass += 1;
                            } else {
                               
                                subjectWise[subject.name].fail += 1;
                            }
                        });
                    }
               
                );
                 

                    tempData[t_nm] = {
                        totalPass,
                        totalFail,
                        subjectWise,
                    };
                    totalPass = 0;
                 totalFail = 0;
                } catch (error) {
                    console.error(`Error fetching marksheets for template ${t_nm}:`, error);
                }
            }

            setMarksheetData(tempData);
        };

        const fetchData = async () => {
            setLoading(true);
            console.log("hgdjasdjasghhads")
            await fetchTemplates();
            await fetchMarksheetsByTemplates();
            setLoading(false);
        };

        fetchData();
    }




    useEffect(() => {
        const fetchUser = async () => {
          
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/auth/me'); 
                    setUser(res.data);
                    console.log(res.data)
                    rel();
                    
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
                        rel();

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

                    <Route path="/" element={<> <NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Home user={user} templates={templates} marksheetData={marksheetData} loading={loading} name={name} rel={rel}/></>} />
                    <Route path="/analyze" element={<> <NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Analyze user={user} templates={templates} marksheetData={marksheetData} loading={loading} name={name} rel={rel}/></>} />

                    <Route path="/login" element={ <Login  />} />
                    <Route path="/signup" element={<> <NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Signup /></>}  />
                    <Route path="/template" element={<><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Common user={user} setReload={setReload}/></>} />
                    <Route path="/marks/:t_nm" element={ <><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Table user={user} setReload={setReload}/></>} />
                    <Route path="/marksheets/:t_nm" element={<><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/> <Marksheet user={user}/> </>} />
                    <Route path="/images_update" element={<><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Image_upd user={user}/></>} />
                    <Route path="/GenTemplate" element={<><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><GenTemplate user={user}/></>} />
                    <Route path="/students/:temp_name" element={<><NavbarComponent rel={rel} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Student user={user}/></>} />
                    
                </Routes>
             
            </div>
            <Footer/>
        </Router>
    );
};
// table compoonent paakanum


//first navbar,css sttyle,more fn(delete,update),pdf download alter pannanum.

export default App;

