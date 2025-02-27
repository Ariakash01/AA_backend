import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import '../App.css';

const Login = ({ setUser,fetchUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
const[loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setLoading(false);
            fetchUser();
            navigate('/');
        } catch (err) {
                        setLoading(false);

            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className={loading ? 'loading' : ''}>
             {loading && (
                <div className="overlay">
                    <Spinner animation="border" id='sspp' />
                </div>
            )}
        <Container className='main_login'>
        <div >
             <h3 className="text-center ">Excel To Pdf Converter</h3>
                 <p className="text-center  mb-3">(Specialized Software for Report Card Generation)</p>
             </div>
            <h2 className="my-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}

                
            <Form onSubmit={handleSubmit} className='form_login'>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3" style={{ position: 'relative' }}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            top: '70%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                        }}
                    >
                        {passwordVisible ?  <IoEyeOutline />: <FaRegEyeSlash /> 
                        }
                    </span>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
{/*
            <span className='ma'>
                Create An Account
            </span>
            <span>
                <Button variant="primary" className='ml-3'>
                    <Link to={'/signup'} className='dec'>Signup</Link>
                </Button>
            </span>
            */}
        </Container>
        </div>
    );
};

export default Login;






