




import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import  '../App.css'

const NavbarComponent = ({ user, handleLogout }) => {
    const [templates, setTemplates] = useState([]);
    const [name,setName]=useState([])
    const navigate = useNavigate();




  

 
    useEffect(() => {
        const fetchTemplates = async () => {
            if (user) {
                try {
                    const res = await axios.get('/marksheets');
                    setTemplates(res.data);

                    const uniqueNames = new Set();

                    // Step 2: Loop through the marksheets array and add each name to the Set
                    res.data.forEach(marksheet => uniqueNames.add(marksheet.templateName));
                    
                    // Step 3: Convert Set back to an array if needed
                    const uniqueNameArray = Array.from(uniqueNames);
                    setName(uniqueNameArray)
                    
                    console.log(uniqueNameArray); 
                    
                } catch (error) {
                    console.error('Error fetching templates:', error);
                }
            }
        };
        fetchTemplates();
    }, [user,name]);

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

    return (
        <Navbar bg="light" expand="lg" className='navbarr'>
            <Container>
                <Navbar.Brand as={Link} to="/" className='wel'>{user.dept}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className='menu'/>
                <Navbar.Collapse id="basic-navbar-nav">
                    {user && (
                        <>
                            <Nav  className=" me-auto my-2 my-lg-0 navv"
            
           >
                                <Nav.Link   as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/template">Template</Nav.Link>
                                <NavDropdown title="Marks" id="marks-nav-dropdown" >
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
                              
                                <NavDropdown title="Marksheets" id="marksheets-nav-dropdown">
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
                                <Nav.Link   as={Link} to="/images_update">Image_Update</Nav.Link>
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
    );
};

export default NavbarComponent;

