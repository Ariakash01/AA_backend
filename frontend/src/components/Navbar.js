
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import  '../App.css'
import logoo from '../logoo.png'
const NavbarComponent = () => {



    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/auth/me'); 
                    setUser(res.data);
                    console.log("From nav"+res.data)
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, []);


    const [templates, setTemplates] = useState([]);
    const [name,setName]=useState([])
    const [studs, setStudents] = useState([]);
    const [temp_name,setStu_Temp_Name]=useState([])
    const navigate = useNavigate();




  
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
        setUser(null);
       
    };
 
    useEffect(() => {
        const fetchTemplates = async () => {
            if (user) {
                try {
                    const res = await axios.get('/marksheets');
                    setTemplates(res.data);

                    const uniqueNames = new Set();

                 
                    res.data.forEach(marksheet => uniqueNames.add(marksheet.templateName));
                    
              
                    const uniqueNameArray = Array.from(uniqueNames);
                    setName(uniqueNameArray)
                    
                    console.log(uniqueNameArray); 
                    
                } catch (error) {
                    console.error('Error fetching templates:', error);
                }
            }
        };
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        if (user) {
            try {
                const res = await axios.get('/marksheets');
                setTemplates(res.data);

                const uniqueNames = new Set();

             
                res.data.forEach(marksheet => uniqueNames.add(marksheet.templateName));
                
          
                const uniqueNameArray = Array.from(uniqueNames);
                setName(uniqueNameArray)
                
                console.log(uniqueNameArray); 
                
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        }
    };
   
    const fetchStud = async () => {
        if (user) {
            try {
                const res = await axios.get(`/students/stu/${user._id}`);
                setStudents(res.data);

                const uniqueNames = new Set();

             
                res.data.forEach(student => uniqueNames.add(student.temp_name));
                
          
                const uniqueNameArray = Array.from(uniqueNames);
                setStu_Temp_Name(uniqueNameArray)
                
                console.log(uniqueNameArray); 
                
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        }
    };
    const handleDelete = async (template) => {
        try {
            console.log(`11${template}`)
            await axios.delete(`/marksheets/mark/mar?templateName=${encodeURIComponent(template)}`);
            console.log(template)
            setTemplates(templates.filter(templatee => templatee.templateName !== template));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleDelete_student = async (template) => {
        try {
            console.log(`${template}`)
            await axios.delete(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/studs/${user._id}?templateName=${encodeURIComponent(template)}`);
            console.log(template)
            setStudents(studs.filter(templatee => templatee.temp_name !== template));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    return (
        <>
        {user &&
        <Navbar  expand="lg" className='navbarr' >
        <Container className='dis_nav'>

            {user && (
                        <Nav.Link   as={Link} to="/" className='nav_borrr'>
            <img src={user.imagePath || logoo} width={50} height={50} className='mr-2 im_br' ></img>
                </Nav.Link>
                )}
                                <Navbar.Toggle aria-controls="basic-navbar-nav" className='menu'/>

                <Navbar.Collapse id="basic-navbar-nav">
                    {user && (
                        <>
                            <Nav  className=" me-auto my-2 my-lg-0 navv" >
                                <Nav.Link   as={Link} to="/" className='mmove' id="na">Home</Nav.Link>
                                <Nav.Link   as={Link} to="/GenTemplate" className='mmove' id="na">Create Stud</Nav.Link>
                              
                                <Nav.Link as={Link} to="/template" className='mmove' id="na">Template</Nav.Link>

                                <NavDropdown title="Students" id="marksheets-nav-dropdown na"  onClick={fetchStud} className='mmove na'>
                                <div className='scroll'>
                                    {temp_name.map(temp_name => (
                                         <p className="ss"> 
                                        <NavDropdown.Item key={temp_name} as={Link} to={`/students/${temp_name}`} className="nav_item">
                                        <span className="nav_item"> {temp_name}</span>
                                         
                                            <Button variant="danger" size="sm" className="ms-2" onClick={(e) => { e.preventDefault(); handleDelete_student(temp_name); }}>
                                                Delete
                                            </Button>
                                            <NavDropdown.Divider/>
                                        </NavDropdown.Item>
                                        </p>
                                    ))}
                                    </div>
                                </NavDropdown>

                                <NavDropdown title="Update" id="marks-nav-dropdown na1" onClick={fetchTemplates} className='mmove na'>
                                    <div className='scroll'>
                                    {name.map(template => (
                                   

                        
                          
                                    (    <p className="ss">  
                                        <NavDropdown.Item key={template} as={Link} to={`/marks/${template}`} >
                                            <span className="nav_item"> {template}</span>
                                           
                                            <Button variant="danger" size="sm" className="ms-2" onClick={(e) => { e.preventDefault(); handleDelete(template); }}>
                                                Delete
                                            </Button>
                                            <NavDropdown.Divider />
                                        </NavDropdown.Item>
                                        </p>
                                     
                                    )
                                
                            
                                   ) )}
                                    </div>
                                </NavDropdown>
                              
                                <NavDropdown title="Marksheets" id="marksheets-nav-dropdown na"  onClick={fetchTemplates} className='mmove na'>
                                <div className='scroll'>
                                    {name.map(template => (
                                         <p className="ss"> 
                                        <NavDropdown.Item key={template} as={Link} to={`/marksheets/${template}`} className="nav_item">
                                        <span className="nav_item"> {template}</span>
                                         
                                            <Button variant="danger" size="sm" className="ms-2" onClick={(e) => { e.preventDefault(); handleDelete(template); }}>
                                                Delete
                                            </Button>
                                            <NavDropdown.Divider/>
                                        </NavDropdown.Item>
                                        </p>
                                    ))}
                                    </div>
                                </NavDropdown>





                              


                                <Nav.Link   as={Link} to="/images_update" className='mmove' id="na">Image_Update</Nav.Link>
                            
                            </Nav>
                            <Nav className="ms-auto  nav">
                                <Navbar.Text className="me-3 ml-3">
                                    <a href="#login" className="padd"> {user.name}</a>
                                </Navbar.Text>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </Nav>
                        </>
                    )}
                  
                </Navbar.Collapse>
            </Container>
        </Navbar>

                }

{

    !user && 
    <div className='navvv'>
                        
                                      
        <img src={logoo} width={52} height={52} className='img_move' ></img>

   
       <div className=" me-auto my-2 my-lg-0  ml-3 nav_flex">

         <div className=" navv_flex">
             <Link   to="/login" className=" navvv_flex">Login</Link>
             <Link to="/signup" className=" navvv_flex">Signup</Link>
        </div>
     </div>
       
     </div>
     
    
     }
</>
    );
};

export default NavbarComponent;

