import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa"
// frontend/src/components/Signup.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert ,Toast,Spinner} from 'react-bootstrap';
import '../App.css';

const Signup = ({ user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [college, setCollege] = useState('Dr. Sivanthi Aditanar College of Engineering');
    const [dept, setDept] = useState('Information Technology');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
            const res = await axios.post(`/auth/signup/${user._id}`, { name, email, college, dept, password, confirmPassword ,isAdmin:false});
            console.log("ssssssss")
            setLoading(false);
            setSuccess("Successfully Created ")

            
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Creation failed');
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
            <h2 className="my-4">Create Advisor</h2>
            {error && (
                <Toast
                    onClose={() => setError('')}
                    show={!!error}
                    delay={3000}
                    autohide
                    bg="danger"
                    className="position-fixed top-20vh end-0 m-3"
                >
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            )}
            {success && (
                <Toast
                    onClose={() => setSuccess('')}
                    show={!!success}
                    delay={3000}
                    autohide
                    bg="success"
                    className="position-fixed top-20vh end-0 m-3"
                >
                    <Toast.Body>{success}</Toast.Body>
                </Toast>
            )}
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

               



                <Form.Group className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Select
            type="text"
            placeholder="Enter your Department"
            value={user.dept||dept}
            onChange={(e) => setDept(e.target.value)}
            required
        >
            <option value="">Select Department</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
            <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
            <option value="Master of Business Administration">Master of Business Administration</option>
        </Form.Select>
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
Create                </Button>
            </Form>{/*
            <span className='ma'>Already Have An Account</span>
            <span>
                <Button variant="primary" className='ml-3'>
                    <Link to={'/login'} className='dec'>Login</Link>
                </Button>
            </span>
            */}
        </Container>
        </div>
    );
};

export default Signup;
