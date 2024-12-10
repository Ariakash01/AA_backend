import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Table, Form, Button, Container, Toast, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import * as XLSX from 'xlsx';

const TableComponent = ({ user,setReload }) => {
    const [marksheets, setMarksheets] = useState([]);
    const [formInput, setFormInput] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { t_nm } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}/${user._id}`);
                if (res.data && Array.isArray(res.data)) {
                    setMarksheets(res.data);
                    const initialFormInput = res.data.map(item => ({
                        _id: item._id,
                        stu_name: item.stu_name || '',
                        rollno: item.rollno || '',
                        attendanceRate: item.attendanceRate || '',
                        toAddress: item.toAddress || '',
                        remarks: item.remarks || 'Work Hard. Study well and can do better',
                        subjects: item.subjects.map(subject => ({
                            code: subject.code,
                            scoredMark: subject.scoredMark || ''
                        }))
                    }));
                    setFormInput(initialFormInput);
                } else {
                    setError('Invalid data format received from the server');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, [t_nm]);
    const fetchMarksheets = async () => {
        try {
            const res = await axios.get(`/marksheets/marksheet/${t_nm}/${user._id}`);
            if (res.data && Array.isArray(res.data)) {
                setMarksheets(res.data);
                const initialFormInput = res.data.map(item => ({
                    _id: item._id,
                    stu_name: item.stu_name || '',
                    rollno: item.rollno || '',
                    attendanceRate: item.attendanceRate || '',
                    toAddress: item.toAddress || '',
                    remarks: item.remarks || 'Work Hard. Study well and can do better',
                    subjects: item.subjects.map(subject => ({
                        code: subject.code,
                        scoredMark: subject.scoredMark || ''
                    }))
                }));
                setFormInput(initialFormInput);
            } else {
                setError('Invalid data format received from the server');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch marksheets');
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            console.log('Parsed rows:', rows);

            const response = await axios.put('http://localhost:5000/api/marksheets/upload-marks', {
                t_nm,
                userId: user._id,
                marks: rows,
            });

            setSuccess(response.data.message);
            fetchMarksheets();
            setFile(null);
        } catch (err) {
            console.error('Error processing file:', err);
            setError(err.response?.data?.message || 'Failed to process the file.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (templateId, field, value) => {
        setFormInput(prevInput =>
            prevInput.map(input =>
                input._id === templateId
                    ? { ...input, [field]: value }
                    : input
            )
        );
    };
    const handleDelete = async (marksheetData) => {
        const { _id } = marksheetData;
        try {
            await axios.delete(`/marksheets/${_id}`);
            setMarksheets(marksheets.filter(template => template._id !== _id));
            setSuccess('Template deleted successfully');
            setError('');
        } catch (error) {
            setError('Error deleting template');
        }
    };
    const handleSubjectChange = (templateId, code, field, value) => {
        setFormInput(prevInput =>
            prevInput.map(input =>
                input._id === templateId
                    ? {
                        ...input,
                        subjects: input.subjects.map(subject =>
                            subject.code === code
                                ? { ...subject, [field]: value }
                                : subject
                        )
                    }
                    : input
            )
        );
    };

    const handleUpdateOnBlur = async (templateId) => {
        const updatedData = formInput.find(input => input._id === templateId);

        try {
            await axios.put(`/marksheets/${templateId}/students`, updatedData);
            setReload(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update data');
            setSuccess('');
        }
    };

    return (
        <Container>
            <h2 className="my-4">Update Marks</h2>

            <h4 className="my-4 ctre">{t_nm}</h4>
            <p className="my-4 ctre">{marksheets.length} Student(s) Found</p>

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

            <div className="mb-4">
                <Form.Group controlId="fileUpload">
                    <Form.Label>Upload Marks via Excel</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        value={file ? file.name : ''} // Update to reflect the file name
                    />
                </Form.Group>
            </div>

            <hr className="my-4" /> {/* Divider between sections */}

            <div>
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    marksheets.length === 0 ? (
                        <p>No records found.</p>
                    ) : (
                        marksheets.map(marksheet => (
                            <div key={marksheet._id} className="container bo">
                                <Table striped bordered hover responsive className="tablle" variant="primary">
                                    <thead>
                                        <tr>
                                            <th>Roll_Number</th>
                                            <th>Student_Name</th>
                                            {marksheet.subjects.map(subject => (
                                                <th key={subject.code}>{subject.name} ({subject.code})</th>
                                            ))}
                                            <th>Attendances</th>
                                            <th>ToAddress</th>
                                            <th>Remarks_Of_A_Student</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={formInput.find(input => input._id === marksheet._id)?.rollno || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, 'rollno', e.target.value)}
                                                    onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={formInput.find(input => input._id === marksheet._id)?.stu_name || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, 'stu_name', e.target.value)}
                                                    onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                />
                                            </td>
                                            {marksheet.subjects.map(subject => (
                                                <td key={subject.code}>
                                                    <Form.Control
                                                        type="number"
                                                        value={formInput.find(input => input._id === marksheet._id)?.subjects.find(sub => sub.code === subject.code)?.scoredMark || ''}
                                                        onChange={(e) => handleSubjectChange(marksheet._id, subject.code, 'scoredMark', e.target.value)}
                                                        onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                    />
                                                </td>
                                            ))}
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={formInput.find(input => input._id === marksheet._id)?.attendanceRate || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, 'attendanceRate', e.target.value)}
                                                    onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    as="textarea"
                                            
                                                    value={formInput.find(input => input._id === marksheet._id)?.toAddress || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, 'toAddress', e.target.value)}
                                                    onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    as="textarea"
                                                    value={formInput.find(input => input._id === marksheet._id)?.remarks || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, 'remarks', e.target.value)}
                                                    onBlur={() => handleUpdateOnBlur(marksheet._id)}
                                                />
                                            </td>
                                            <td>
                                            <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(formInput.find(input => input._id === marksheet._id))}
                                                >
                                                    Delete
                                                </Button>                                          </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        ))
                    )
                )}
            </div>
        </Container>
    );
}; 
export default TableComponent;