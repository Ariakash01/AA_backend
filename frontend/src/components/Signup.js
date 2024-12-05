import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa"
// frontend/src/components/Signup.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert ,Spinner} from 'react-bootstrap';
import '../App.css';

const Signup = ({ setUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [college, setCollege] = useState('Dr. Sivanthi Aditanar College of Engineering');
    const [dept, setDept] = useState('Information Technology');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const[loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('/auth/signup', { name, email, college, dept, password, confirmPassword });
            localStorage.setItem('token', res.data.token);
            setLoading(false);

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className={loading ? 'loading' : ''}>
             {loading && (
                <div className="overlay">
                    <Spinner animation="border" id='sspp' />
                </div>
            )}
        <Container>
            <h2 className="my-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

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
                
                <Form.Group controlId="formCollege" className="mb-3">
                    <Form.Label>College</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your College"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDept" className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Department"
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
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
                        {passwordVisible ? <IoEyeOutline />: <FaRegEyeSlash /> }
                    </span>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3" style={{ position: 'relative' }}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <span
                        onClick={toggleConfirmPasswordVisibility}
                        style={{
                            position: 'absolute',
                            top: '70%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                        }}
                    >
                        {confirmPasswordVisible ?  <IoEyeOutline />: <FaRegEyeSlash /> }
                    </span>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
            </Form>
            <span className='ma'>Already Have An Account</span>
            <span>
                <Button variant="primary" className='ml-3'>
                    <Link to={'/login'} className='dec'>Login</Link>
                </Button>
            </span>
        </Container>
        </div>
    );
};

export default Signup;
