import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GenTemplate = ({user}) => {
  const [temp_name, setTempName] = useState('');
  const [start_roll_no, setStartRollNo] = useState();
  const [num_students, setNumStudents] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/create-students/${user._id}`, {
        
        temp_name,
        start_roll_no,
        num_students,
      });
     
      console.log("dsfskjdhf")
    
    } catch (error) {
      console.error('Error creating students:', error);
    }
  };

  return (
    <Container>
      <h2>Create Class</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="temp_name">
          <Form.Label>Class Name</Form.Label>
          <Form.Control
            type="text"
            value={temp_name}
            onChange={(e) => setTempName(e.target.value)}
            required
            placeholder='Final Year'
          />
        </Form.Group>

        <Form.Group controlId="start_roll_no">
          <Form.Label>Start Roll Number</Form.Label>
          <Form.Control
            type="number"
            value={start_roll_no}
            onChange={(e) => setStartRollNo(Number(e.target.value))}
            required
            placeholder='11214001'
          />
        </Form.Group>

        <Form.Group controlId="num_students">
          <Form.Label>Number of Students</Form.Label>
          <Form.Control
            type="number"
            value={num_students}
            onChange={(e) => setNumStudents(Number(e.target.value))}
            required
            placeholder='30'
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Create Students
        </Button>
      </Form>
    </Container>
  );
};

export default GenTemplate;
