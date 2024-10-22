// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';

const NavbarComponent = ({ user, handleLogout }) => {
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();




  

 
    useEffect(() => {
        const fetchTemplates = async () => {
            if (user) {
                try {
                    const res = await axios.get('/marksheets');
                    setTemplates(res.data);
                } catch (error) {
                    console.error('Error fetching templates:', error);
                }
            }
        };
        fetchTemplates();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/marksheets/${id}`);
            setTemplates(templates.filter(template => template._id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Information Technology</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {user && (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/template">Template</Nav.Link>
                                <NavDropdown title="Marks" id="marks-nav-dropdown">
                                    {templates.map(template => (
                                        <NavDropdown.Item key={template._id} as={Link} to={'/marks'}>
                                            {template.templateName}
                                            <Button variant="danger" size="sm" className="ms-2" onClick={(e) => { e.preventDefault(); handleDelete(template._id); }}>
                                                Delete
                                            </Button>
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                                <NavDropdown title="Marksheets" id="marksheets-nav-dropdown">
                                    {templates.map(template => (
                                        <NavDropdown.Item key={template._id} as={Link} to={'/marksheets'}>
                                            {template.templateName}
                                            <Button variant="danger" size="sm" className="ms-2" onClick={(e) => { e.preventDefault(); handleDelete(template._id); }}>
                                                Delete
                                            </Button>
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                            </Nav>
                            <Nav className="ms-auto">
                                <Navbar.Text className="me-3">
                                    Signed in as: <a href="#login">{user.name}</a>
                                </Navbar.Text>
                                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                            </Nav>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
