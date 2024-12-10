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
import AdvisorManagement from './AdvisorManagement';
import AdminSignup from './AdminSignup';
import Admin from './Admin';
import UpdateProfile from './UpdateProfile';
import ProtectedRoute from './ProtectedRoute';
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
                        `http://localhost:5000/api/marksheets/ms/${user._id}`
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



    const [classStats, setClassStats] = useState([]);
    const [marksheetStats, setMarksheetStats] = useState([]);
    const [loadingg, setLoadingg] = useState(true);

    // Fetch unique named classes
  


    const fetchUniqueClasses = async () => {
        if (user) {
            try {
                const res = await axios.get(`/students/stu/${user._id}`);
               

                const uniqueNames = new Set();

             
                res.data.forEach(student => uniqueNames.add(student.temp_name));
                
          
                return Array.from(uniqueNames);
               
                
              
                
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        }
    };



    // Fetch unique named marksheets
    const fetchUniqueNamedMarksheets = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/marksheets/ms/${user._id}`
            );
            const uniqueNames = new Set();
            res.data.forEach((marksheet) => uniqueNames.add(marksheet.testName));
            return Array.from(uniqueNames);
        } catch (error) {
            console.error('Error fetching unique named marksheets:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoadingg(true);

            try {
                // Fetch unique classes and their stats
                const uniqueClasses = await fetchUniqueClasses();
                const classData = await Promise.all(
                    uniqueClasses.map(async (className) => {
                        try {
                            const studentRes = await axios.get(
                                `http://localhost:5000/api/students/stu_by_template/${className}/${user._id}`
                            );
                           
                            return {
                                className,
                                students: studentRes.data.length,
                        
                            };
                        } catch (error) {
                            console.error(`Error fetching data for class ${className}:`, error);
                            return {
                                className,
                                students: 0,
                                marksheets: 0,
                            };
                        }
                    })
                );
                console.log(uniqueClasses);
                setClassStats(classData);

                // Fetch unique named marksheets and their counts
                const uniqueMarksheetNames = await fetchUniqueNamedMarksheets();
                const marksheetData = await Promise.all(
                    uniqueMarksheetNames.map(async (testName) => {
                        try {
                            const res = await axios.get(`/marksheets/marksheet/${testName}/${user._id}`);
                            return { testName, count: res.data.length };
                        } catch (error) {
                            console.error(`Error fetching marksheets for ${testName}:`, error);
                            return { testName, count: 0 };
                        }
                    })
                );
                setMarksheetStats(marksheetData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingg(false);
            }
        };

        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoadingg(true);

        try {
            // Fetch unique classes and their stats
            const uniqueClasses = await fetchUniqueClasses();
            const classData = await Promise.all(
                uniqueClasses.map(async (className) => {
                    try {
                        const studentRes = await axios.get(
                            `http://localhost:5000/api/students/stu_by_template/${className}/${user._id}`
                        );
                     
                        return {
                            className,
                            students: studentRes.data.length
                        };
                    } catch (error) {
                        console.error(`Error fetching data for class ${className}:`, error);
                        return {
                            className,
                            students: 0,
                            marksheets: 0,
                        };
                    }
                })
            );
            setClassStats(classData);

            // Fetch unique named marksheets and their counts
            const uniqueMarksheetNames = await fetchUniqueNamedMarksheets();
            const marksheetData = await Promise.all(
                uniqueMarksheetNames.map(async (testName) => {
                    try {
                        const res = await axios.get(`/marksheets/marksheet/${testName}/${user._id}`);
                        return { testName, count: res.data.length };
                    } catch (error) {
                        console.error(`Error fetching marksheets for ${testName}:`, error);
                        return { testName, count: 0 };
                    }
                })
            );
            setMarksheetStats(marksheetData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingg(false);
        }
    }
    const handleDelete_student = async (template) => {
        try {
            console.log(`${template}`)
            await axios.delete(`http://localhost:5000/api/students/studs/${user._id}?templateName=${encodeURIComponent(template)}`);
            fetchData();

            console.log(template)
          /*  setStudents(studs.filter(templatee => templatee.temp_name !== template));*/
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };
    const handleDelete = async (template) => {
        try {
            console.log(`11${template}`)
            await axios.delete(`http://localhost:5000/api/marksheets/mark/${user._id}/mar?templateName=${encodeURIComponent(template)}`);
            fetchData();
            console.log(template)
          /*  setTemplates(templates.filter(templatee => templatee.templateName !== template));*/
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };
    return (
        <Router>
           
            <div className="container mt-4 bod">
              
                <Routes>


                
<Route
    path="/"
    element={
        <>
            <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
            <Home user={user} classStats={classStats} marksheetStats={marksheetStats} templates={templates} marksheetData={marksheetData} loading={loadingg} name={name} rel={rel} />
        </>
    }
/>
<Route path="/login" element={<Login fetchUser={fetchUser} />} />

{/* User Routes */}
<Route
    path="/analyze"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Analyze user={user} templates={templates} marksheetData={marksheetData} loading={loadingg} name={name} rel={rel} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/template"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Common user={user} setReload={setReload} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/marks/:t_nm"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Table user={user} setReload={setReload} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/marksheets/:t_nm"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Marksheet user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/images_update"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Image_upd user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/GenTemplate"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <GenTemplate user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/students/:temp_name"
    element={
        <ProtectedRoute user={user} requiredRole={false} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Student user={user} />
            </>
        </ProtectedRoute>
    }
/>

{/* Admin Routes */}
<Route
    path="/view/advisor"
    element={
        <ProtectedRoute user={user} requiredRole={true} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <AdvisorManagement user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/create"
    element={
        <ProtectedRoute user={user} requiredRole={true} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <AdminSignup user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/view/admin"
    element={
        <ProtectedRoute user={user} requiredRole={true} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Admin user={user} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/update/profile"
    element={
        <ProtectedRoute user={user} requiredRole={true} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <UpdateProfile user={user} fetchUser={fetchUser} />
            </>
        </ProtectedRoute>
    }
/>
<Route
    path="/advisor/create"
    element={
        <ProtectedRoute user={user} requiredRole={true} fetchUser={fetchUser}>
            <>
                <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser} />
                <Signup user={user} />
            </>
        </ProtectedRoute>
    }
/>


{/* 
//below are public route
 <Route path="/" element={<> <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Home user={user} classStats={classStats} marksheetStats={marksheetStats} templates={templates} marksheetData={marksheetData} loading={loadingg} name={name} rel={rel}/></>} />
                    <Route path="/analyze" element={<> <NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Analyze user={user} templates={templates} marksheetData={marksheetData} loading={loading} name={name} rel={rel}/></>} />
//below are user route
                    <Route path="/login" element={ <Login fetchUser={fetchUser} />} />
                    <Route path="/template" element={<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Common user={user} setReload={setReload}/></>} />
                    <Route path="/marks/:t_nm" element={ <><NavbarComponent  handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Table user={user} setReload={setReload}/></>} />
                    <Route path="/marksheets/:t_nm" element={<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/> <Marksheet user={user}/> </>} />
                    <Route path="/images_update" element={<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Image_upd user={user}/></>} />
                    <Route path="/GenTemplate" element={<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><GenTemplate user={user}/></>} />
                    <Route path="/students/:temp_name" element={<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete} rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Student user={user}/></>} />
                  //below are admin route 
                    <Route path="/view/advisor" element={<> <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><AdvisorManagement user={user}/></>} />
                    <Route path="/admin/create" element={<> <NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete}  rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><AdminSignup user={user}/></>}  />
                    <Route path="/view/admin" element={<> <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Admin user={user}/></>} />
                    <Route path="/update/profile" element={<> <NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><UpdateProfile user={user} fetchUser={fetchUser}/></>} />
                    <Route path="/advisor/create" element={<> <NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete}  rel={rel} fetchData={fetchData} user={user} handleLogoutt={handleLogout} fetchUser={fetchUser}/><Signup user={user}/></>}  />

   */}
                   


{
    /* <Route path="/admin/create" element={<> {user.isAdmin?(<><NavbarComponent handleDelete_student={handleDelete_student} handleDelete={handleDelete}  rel={rel} fetchData={fetchData} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><AdminSignup user={user}/></>):(<><NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Home user={user} classStats={classStats} marksheetStats={marksheetStats} templates={templates} marksheetData={marksheetData} loading={loadingg} name={name} rel={rel}/></>)}</>}  />
                    <Route path="/view/admin" element={<> {user.isAdmin?(<><NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Admin user={user}/></>):(<><NavbarComponent rel={rel} handleDelete_student={handleDelete_student} handleDelete={handleDelete} fetchData={fetchData} user={user} handleLogout={handleLogout} fetchUser={fetchUser}/><Home user={user} classStats={classStats} marksheetStats={marksheetStats} templates={templates} marksheetData={marksheetData} loading={loadingg} name={name} rel={rel}/></>)}</>} />
                    */
}

                </Routes>
             
            </div>
            <Footer/>
        </Router>
    );
};
// table compoonent paakanum


//first navbar,css sttyle,more fn(delete,update),pdf download alter pannanum.

export default App;

