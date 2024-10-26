
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance'; // Ensure this is the correct Axios instance
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formInput, setFormInput] = useState({}); // For handling user inputs

    // Fetch all marksheets on component mount
    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get('/marksheets');
                if (res.data && Array.isArray(res.data)) {
                    setMarksheets(res.data);
                } else {
                    setError('Invalid data format received from the server');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, []);

    // Handle changes for each field (marks, attendance, etc.) for a single student
    const handleInputChange = (templateId, field, value) => {
        setFormInput(prevInput => ({
            ...prevInput,
            [templateId]: {
                ...prevInput[templateId],
                [field]: value,
            },
        }));
    };

    const handleSubjectChange = (templateId, code, field, value) => {
        setFormInput(prevInput => ({
            ...prevInput,
            [templateId]: {
                ...prevInput[templateId],
                subjects: {
                    ...prevInput[templateId]?.subjects,
                    [code]: {
                        ...prevInput[templateId]?.subjects?.[code],
                        [field]: value
                    }
                }
            }
        }));
    };

    // Handle submission for a single student
    const handleSubmitStudent = async (templateId) => {
        const { name, rollno, attendanceRate, toAddress, remark, subjects } = formInput[templateId] || {};

        const subjectsArray = Object.entries(subjects || {}).map(([code, subjectData]) => ({
           
            code,
            scoredMark: subjectData.scoredMark
        }));
        console.log(formInput)
      console.log(subjectsArray)
        try {
            await axios.put(`/marksheets/${templateId}/students`, {
                name,
                rollno,
                attendanceRate,
                toAddress,
                remark,
                subjects: subjectsArray
            });
            setSuccess('Student marks updated successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
            setSuccess('');
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
                        <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                    
                                   
                                    {marksheet.subjects.map(subject => (
                                        <th key={subject.code}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To Address</th>
                                    <th>Remark</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={formInput[marksheet._id]?.rollno || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'rollno', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            value={formInput[marksheet._id]?.name || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'name', e.target.value)}
                                        />
                                    </td>
                                    {marksheet.subjects.map(subject => (
                                        <td key={subject.code}>
                                            <Form.Control
                                                type="number"
                                                value={formInput[marksheet._id]?.subjects?.[subject.code]?.scoredMark || ''}
                                                onChange={(e) => handleSubjectChange(marksheet._id, subject.code,'scoredMark', e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={formInput[marksheet._id]?.attendanceRate || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'attendanceRate', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            value={formInput[marksheet._id]?.toAddress || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'toAddress', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            value={formInput[marksheet._id]?.remark || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'remark', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleSubmitStudent(marksheet._id)}
                                        >
                                            Update Student
                                        </Button>
                                    </td>
                                  
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                ))
            )}
        </Container>
    );
};

export default TableComponent;







{/*
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';  // Ensure this is the correct Axios instance
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formInput, setFormInput] = useState({});  // For handling user inputs

    // Fetch all marksheets on component mount
    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get('/marksheets');
                if (res.data && Array.isArray(res.data)) {
                    setMarksheets(res.data); // Assuming `res.data` is an array of marksheets
                } else {
                    setError('Invalid data format received from the server');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, []);

    // Handle changes for each field (marks, attendance, etc.) for a single student
    const handleInputChange = (templateId, studentId, field, value) => {
        setFormInput(prevInput => ({
            ...prevInput,
            [templateId]: {
                ...prevInput[templateId],
                [studentId]: {
                    ...prevInput[templateId]?.[studentId],
                    [field]: value,
                },
            },
        }));
    };

    // Handle submission for a single student
    const handleSubmitStudent = async (templateId, studentId) => {
        try {
            const studentInput = formInput[templateId]?.[studentId];
             console.log(studentInput)

            if (!studentInput) {
                setError('No changes made to submit.');
                return;
            }

            // Send updated student data to the backend
            await axios.put(`/marksheets/${templateId}/students`, studentInput);
            setSuccess('Student marks updated successfully');
            setError(''); // Clear error message if update was successful
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
            setSuccess(''); // Clear success message if an error occurred
        }
    };

    // Handle submission of a complete marksheet for multiple students
    const handleSubmitAll = async (templateId) => {
        try {
            const marksheetInput = formInput[templateId];
            if (!marksheetInput) {
                setError('No changes made to submit.');
                return;
            }

            // Send updated students data to the backend
            await axios.put(`/marksheets/app/${templateId}`, { students: marksheetInput });
            setSuccess('All marks updated successfully');
            setError(''); // Clear error message if update was successful
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update marks');
            setSuccess(''); // Clear success message if an error occurred
        }
    };

    return (


        <>
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
                        <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    {marksheet.subjects && marksheet.subjects.map((subject, index) => (
                                        <th key={index}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To Address</th>
                                    <th>Remark</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                       <td>
                                            <Form.Control
                                                type="text"
                                                value={formInput[marksheet._id]?.[marksheet._id]?.name || ''}
                                                onChange={(e) => handleInputChange(marksheet._id, marksheet._id, 'name', e.target.value)}
                                            />
                                        </td>
                                    <td>
                                            <Form.Control
                                                type="number"
                                                value={formInput[marksheet._id]?.[marksheet._id]?.rollno || '11214004'}
                                                onChange={(e) => handleInputChange(marksheet._id, marksheet._id, 'rollno', e.target.value)}
                                            />
                                        </td>
                                    
                                        {marksheet.subjects && marksheet.subjects.map((subject, idx) => (
                                            <td key={idx}>
                                                <Form.Control
                                                    type="number"
                                                    value={formInput[marksheet._id]?.[marksheet._id]?.[subject.code] || ''}
                                                    onChange={(e) => handleInputChange(marksheet._id, marksheet._id, subject.code, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={formInput[marksheet._id]?.[marksheet._id]?.attendanceRate || ''}
                                                onChange={(e) => handleInputChange(marksheet._id, marksheet._id, 'attendanceRate', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                value={formInput[marksheet._id]?.[marksheet._id]?.toAddress || ''}
                                                onChange={(e) => handleInputChange(marksheet._id, marksheet._id, 'toAddress', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={formInput[marksheet._id]?.[marksheet._id]?.remark || ''}
                                                onChange={(e) => handleInputChange(marksheet._id, marksheet._id, 'remark', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleSubmitStudent(marksheet._id, marksheet._id)}
                                            >
                                                Update Student
                                            </Button>
                                        </td>
                                    </tr>
                                
                            </tbody>
                        </Table>
                       
                    </div>
                
                ))
               
            )
         
            
            }
             <Button variant="primary" onClick={() => handleSubmitAll(marksheets._id)}>
                Update All Marks
            </Button>
        </Container>  
               </>
    );
};

export default TableComponent;

*/}









{/*
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';  // Ensure this is the correct Axios instance
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch all marksheets on component mount
    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get('/marksheets');
                if (res.data && Array.isArray(res.data)) {
                    setMarksheets(res.data); // Assuming `res.data` is an array of marksheets
                } else {
                    setError('Invalid data format received from the server');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, []);

    // Handle changes for each field (e.g., marks, attendance, etc.)
    const handleChange = (templateId, studentId, field, value) => {
        setMarksheets(prevMarksheets =>
            prevMarksheets.map(marksheet => {
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

    // Update all students' marks, attendance, and other fields for a specific marksheet
    const handleSubmitAll = async (templateId) => {
        try {
            const marksheet = marksheets.find(m => m._id === templateId);
            if (!marksheet) {
                setError('Marksheets not found');
                return;
            }
            const updatedStudents = marksheet.students.map(student => ({
                ...student,
                marks: student.marks, // Ensure this exists
                attendanceRate: student.attendanceRate, // Ensure this exists
                toAddress: student.toAddress, // Ensure this exists
                remark: student.remark // Ensure this exists
            }));

            // Send updated students data to the backend
            await axios.put(`/marksheets/${templateId}`, { students: updatedStudents });
            setSuccess('All marks updated successfully');
            setError(''); // Clear error message if update was successful
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update marks');
            setSuccess(''); // Clear success message if an error occurred
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
                        <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    {marksheet.subjects && marksheet.subjects.map((subject, index) => (
                                        <th key={index}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To Address</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksheet.students && marksheet.students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.rollNo}</td>
                                        <td>{student.name}</td>
                                        {marksheet.subjects && marksheet.subjects.map((subject, idx) => (
                                            <td key={idx}>
                                                <Form.Control
                                                    type="number"
                                                    value={student.marks?.[subject.code] || ''}
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


*/}


















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