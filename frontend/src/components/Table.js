// frontend/src/components/Table.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get('/marksheets');
                setMarksheets(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, []);

    // Handle changes for multiple students and dynamically adjust the marks and fields
    const handleChange = (templateId, studentId, field, value) => {
        setMarksheets(prev =>
            prev.map(marksheet => {
                if (marksheet._id === templateId) {
                    return {
                        ...marksheet,
                        students: marksheet.students.map(student => {
                            if (student._id === studentId) {
                                return { ...student, [field]: value };
                            }
                            return student;
                        }),
                    };
                }
                return marksheet;
            })
        );
    };

    // Bulk submit for updating all students' marks, attendance, etc.
    const handleSubmitAll = async (templateId) => {
        try {
            const marksheet = marksheets.find(m => m._id === templateId);
            const updatedStudents = marksheet.students.map(student => ({
                ...student,
                // Combine fields into an object to be sent to the backend
                marks: student.marks,
                attendanceRate: student.attendanceRate,
                toAddress: student.toAddress,
                remark: student.remark,
            }));

            // Send the updated marksheet (with all students' data) to the backend
            await axios.put(`/marksheets/${templateId}`, { students: updatedStudents });
            setSuccess('All marks updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update marks');
        }
    };

    return (
        <Container>
            <h2 className="my-4">Update Marks</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            {marksheets.length === 0 ? (
                <p>No records found.</p>
            ) : (
                marksheets.map((marksheet )=> (
                    <div key={marksheet._id} className="mb-4">
                        <h4>{marksheet.templateName}</h4>
                        <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    {marksheet.subjects.map((subject, index) => (
                                        <th key={index}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To Address</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksheet.students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.rollNo}</td>
                                        <td>{student.name}</td>
                                        {marksheet.subjects.map((subject, idx) => (
                                            <td key={idx}>
                                                <Form.Control
                                                    type="number"
                                                    value={student.marks[subject.code] || ''}
                                                    onChange={(e) => handleChange(marksheet._id, student._id, `marks.${subject.code}`, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={student.attendanceRate || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'attendanceRate', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                value={student.toAddress || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'toAddress', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={student.remark || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'remark', e.target.value)}
                                                required={false}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button variant="primary" onClick={() => handleSubmitAll(marksheet._id)}>
                            Update All Marks
                        </Button>
                    </div>
                ))
            )}
        </Container>
    );
};

export default TableComponent;





















{/*


// frontend/src/components/Table.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get('/marksheets');
                setMarksheets(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, []);

    // Handles changes for multiple students at once
    const handleChange = (templateId, studentId, field, value) => {
        setMarksheets(prev =>
            prev.map(marksheet => {
                if (marksheet._id === templateId) {
                    return {
                        ...marksheet,
                        students: marksheet.students.map(student => {
                            if (student._id === studentId) {
                                return { ...student, [field]: value };
                            }
                            return student;
                        }),
                    };
                }
                return marksheet;
            })
        );
    };

    // Bulk submit for updating all students' marks, attendance, etc.
    const handleSubmitAll = async (templateId) => {
        try {
            const marksheet = marksheets.find(m => m._id === templateId);
            const updatedStudents = marksheet.students.map(student => ({
                ...student,
                // Flatten and combine fields into an object to be sent to the backend
                marks: student.marks,
                attendanceRate: student.attendanceRate,
                toAddress: student.toAddress,
                remark: student.remark,
            }));

            // Send the updated marksheet (with all students' data) to the backend
            await axios.put(`/marksheets/${templateId}`, { students: updatedStudents });
            setSuccess('All marks updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update marks');
        }
    };

    return (
        <Container>
            <h2 className="my-4">Update Marks</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            {marksheets.length === 0 ? (
                <p>No records found.</p>
            ) : (
                marksheets.map(marksheet => (
                    <div key={marksheet._id} className="mb-4">
                        <h4>{marksheet.templateName}</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    {marksheet.subjects.map((subject, index) => (
                                        <th key={index}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To Address</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksheet.students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.rollNo}</td>
                                        <td>{student.name}</td>
                                        {marksheet.subjects.map((subject, idx) => (
                                            <td key={idx}>
                                                <Form.Control
                                                    type="number"
                                                    value={student.marks[subject.code] || ''}
                                                    onChange={(e) => handleChange(marksheet._id, student._id, `marks.${subject.code}`, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={student.attendanceRate || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'attendanceRate', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                value={student.toAddress || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'toAddress', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={student.remark || ''}
                                                onChange={(e) => handleChange(marksheet._id, student._id, 'remark', e.target.value)}
                                                required={false}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={() => handleSubmitAll(marksheet._id)}>Update All Marks</Button>
                    </div>
                ))
            )}
        </Container>
    );
};

export default TableComponent;
*/}