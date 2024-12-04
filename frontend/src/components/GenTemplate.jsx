import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const GenTemplate = ({ user }) => {
  const [temp_name, setTempName] = useState('');
  const [start_roll_no, setStartRollNo] = useState('');
  const [num_students, setNumStudents] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(true);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleToggle = (mode) => {
    setIsManualEntry(mode);
    setTempName('');
    setStartRollNo('');
    setNumStudents('');
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isManualEntry) {
        // Manual Entry: Send individual details
        await axios.post(
          `https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/create-students/${user._id}`,
          {
            temp_name,
            start_roll_no,
            num_students,
          }
        );
      } else {
        // File Upload: Parse Excel and send data in bulk
        if (!file || !temp_name) {
          setError('Please select a class name and upload an Excel file.');
          setLoading(false);
          return;
        }

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Validate that required columns exist
        const isValid = rows.every((row) => row.RollNumber && row.StudentName);
        if (!isValid) {
          setError('Excel file must contain "RollNumber" and "StudentName" columns.');
          setLoading(false);
          return;
        }

        await axios.post(
          `https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/create-students/${user._id}`,
          {
            temp_name,
            students: rows,
          }
        );
      }
      setLoading(false);

      alert('Class created successfully');
      setFile(null);
    } catch (error) {
      console.error('Error creating students:', error);
      setError('Failed to create students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={loading ? 'loading' : ''}>
      {loading && (
        <div className="overlay">
          <Spinner animation="border" />
        </div>
      )}
      <h2>Create Class</h2>
      <div className="mb-3 op">
        <Button variant="outline-primary" onClick={() => handleToggle(true)} active={isManualEntry}>
          Manual Entry
        </Button>
        <Button variant="outline-primary" onClick={() => handleToggle(false)} active={!isManualEntry} className="ms-2">
          Upload Excel
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="temp_name">
          <Form.Label>Class Name</Form.Label>
          <Form.Select
            value={temp_name}
            onChange={(e) => setTempName(e.target.value)}
            required
          >
            <option value="">Select Class Name</option>
            <option value="First Batch 1">First Batch 1</option>
            <option value="First  Batch 2">First Batch 2</option>

            <option value="First Batch 3">First Batch 3</option>
            <option value="First Batch 4">First Batch 4</option>

            <option value="Second Batch 1">Second Batch 1</option>
            <option value="Second Batch 2">Second Batch 2</option>
            <option value="Second Batch 3">Second Batch 3</option>
            <option value="Second Batch 4">Second Batch 4</option>
            <option value="Third Batch 1">Third Batch 1</option>
            <option value="Third Batch 2">Third Batch 2</option>
            <option value="Third Batch 3">Third Batch 3</option>
             <option value="Third Batch 4">Third Batch 4</option>
            <option value="Fourth Batch 1">Fourth Batch 1</option>
            <option value="Fourth Batch 2">Fourth Batch 2</option>

            <option value="Fourth Batch 3">Fourth Batch 3</option>

            <option value="Fourth Batch 4">Fourth Batch 4</option>

          </Form.Select>
        </Form.Group>

        {isManualEntry ? (
          <>
            <Form.Group controlId="start_roll_no">
              <Form.Label>Start Roll Number</Form.Label>
              <Form.Control
                type="number"
                value={start_roll_no}
                onChange={(e) => setStartRollNo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="num_students">
              <Form.Label>Number of Students</Form.Label>
              <Form.Control
                type="number"
                value={num_students}
                onChange={(e) => setNumStudents(e.target.value)}
                required
              />
            </Form.Group>
          </>
        ) : (
          <Form.Group controlId="file">
            <Form.Label>Upload Student Excel File</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        )}

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
          {loading ? 'Creating...' : 'Create Students'}
        </Button>
      </Form>
    </Container>
  );
};

export default GenTemplate;
