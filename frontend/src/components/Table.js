
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [formInput, setFormInput] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { t_nm } = useParams();

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
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

    const handleInputChange = (templateId, field, value) => {
        setFormInput(prevInput =>
            prevInput.map(input =>
                input._id === templateId
                    ? { ...input, [field]: value }
                    : input
            )
        );
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

    const handleSubmitStudent = async (marksheetData) => {
        const { _id, stu_name, rollno, attendanceRate, toAddress, remarks, subjects } = marksheetData;
        
        try {
            await axios.put(`/marksheets/${_id}/students`, {
                stu_name,
                rollno,
                attendanceRate,
                toAddress,
                remarks,
                subjects
            });
            setSuccess('Student marks updated successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
            setSuccess('');
        }
    };

    const handleUpdateAll = async () => {
        try {
            await Promise.all(formInput.map(marksheet => handleSubmitStudent(marksheet)));
            setSuccess('All marksheets updated successfully');
            setError('');
        } catch (err) {
            setError('Failed to update all marksheets');
            setSuccess('');
        }
    };






    return (
        <Container>
            <h2 className="my-4">Update Marks</h2>
            <div className='upd_all'>

<Button variant="primary"  onClick={handleUpdateAll}>
    Update All
</Button>
</div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            {marksheets.length === 0 ? (
                <p>No records found.</p>
            ) : (
                marksheets.map(marksheet => (
                    <div key={marksheet._id} className=" container ">
                        <h4>{marksheet.templateName}</h4>
                        <Table striped bordered hover responsive className="tablle">
                            <thead>
                                <tr>
                                    <th>Roll_Number</th>
                                    <th>Student_Name</th>
                                    {marksheet.subjects.map(subject => (
                                        <th key={subject.code}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance_Rate</th>
                                    <th>To_Address_For_A_Student</th>
                                    <th>Remarks_For_A_Student</th>
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
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            value={formInput.find(input => input._id === marksheet._id)?.stu_name || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'stu_name', e.target.value)}
                                        />
                                    </td>
                                    {marksheet.subjects.map(subject => (
                                        <td key={subject.code}>
                                            <Form.Control
                                                type="number"
                                                value={formInput.find(input => input._id === marksheet._id)?.subjects.find(sub => sub.code === subject.code)?.scoredMark || ''}
                                                onChange={(e) => handleSubjectChange(marksheet._id, subject.code, 'scoredMark', e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={formInput.find(input => input._id === marksheet._id)?.attendanceRate || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'attendanceRate', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={formInput.find(input => input._id === marksheet._id)?.toAddress || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'toAddress', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={formInput.find(input => input._id === marksheet._id)?.remarks || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'remarks', e.target.value)}
                                        />
                                    </td>
                                    <td className='upd_del'>
                                        <Button
                                            variant="success"
                                            onClick={() => handleSubmitStudent(formInput.find(input => input._id === marksheet._id))}
                                        >
                                            Update
                                        </Button>
                                        <Button className='upd_del' variant="danger" className='del pr-5' onClick={() => handleDelete(formInput.find(input => input._id === marksheet._id))}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                ))
            )}

            <div className='upd_all'>

            <Button variant="primary"  onClick={handleUpdateAll}>
                Update All
            </Button>
            </div>
           
        </Container>
    );
};

export default TableComponent;







{/*
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../App.css'
const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formInput, setFormInput] = useState({});
    const { t_nm } = useParams();

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
                if (res.data && Array.isArray(res.data)) {
                    setMarksheets(res.data);
                    
                    // Initialize formInput with data from marksheets
                    const initialFormInput = res.data.reduce((acc, item) => {
                        acc[item._id] = {
                            stu_name: item.stu_name || '',  // Ensure name is set
                            rollno: item.rollno || '',
                            attendanceRate: item.attendanceRate || '',
                            toAddress: item.toAddress || '',
                            remarks: item.remarks || '',  // Ensure remark is set
                            subjects: item.subjects.reduce((subAcc, subject) => {
                                subAcc[subject.code] = { scoredMark: subject.scoredMark || '' };
                                return subAcc;
                            }, {}),
                        };
                        return acc;
                    }, {});
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
                        [field]: value,
                    },
                },
            },
        }));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/marksheets/${id}`);
            setMarksheets(marksheets.filter(template => template._id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleSubmitStudent = async (templateId) => {
        const { stu_name, rollno, attendanceRate, toAddress, remarks, subjects } = formInput[templateId] || {};
        const subjectsArray = Object.entries(subjects || {}).map(([code, subjectData]) => ({
            code,
            scoredMark: subjectData.scoredMark,
        }));

        try {
            await axios.put(`/marksheets/${templateId}/students`, {
                stu_name,
                rollno,
                attendanceRate,
                toAddress,
                remarks,
                subjects: subjectsArray,
            });
            setSuccess('Student marks updated successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
            setSuccess('');
        }
    };

    const handleUpdateAll = async () => {
        const modifiedMarksheets = Object.entries(formInput).map(([templateId, data]) => {
            const subjectsArray = Object.entries(data.subjects || {}).map(([code, subjectData]) => ({
                code,
                scoredMark: subjectData.scoredMark,
            }));
            return {
                _id: templateId,
                stu_name: data.stu_name,
                rollno: data.rollno,
                attendanceRate: data.attendanceRate,
                toAddress: data.toAddress,
                remarks: data.remarks,
                subjects: subjectsArray,
            };
        });

        try {
            const response = await axios.put(`/marksheets/updateAll`, { marksheets: modifiedMarksheets });
            setSuccess('All modified marksheets updated successfully');
            setError('');
            console.log(response.data.updatedMarksheets);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update all marksheets');
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
                    <div key={marksheet._id} className="mb-4 containeer">
                        <h4>{marksheet.templateName}</h4>
                        <Table  striped bordered hover responsive className="tablee">
                            <thead>
                                <tr>
                                    <th classname=" detail">Roll_Number</th>
                                    <th classname=" detail">Student_Name</th>
                                    {marksheet.subjects.map(subject => (
                                        <th key={subject.code}>{subject.name} ({subject.code})</th>
                                    ))}
                                    <th>Attendance Rate</th>
                                    <th>To_Address_For_A_Student</th>
                                    <th>Remarks_For_A_Student</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            value={formInput[marksheet._id]?.rollno || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'rollno', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control className='ato'
                                            type="text"
                                            value={formInput[marksheet._id]?.stu_name || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'stu_name', e.target.value)}
                                        />
                                    </td>
                                    {marksheet.subjects.map(subject => (
                                        <td key={subject.code}>
                                            <Form.Control
                                                type="number"
                                                value={formInput[marksheet._id]?.subjects?.[subject.code]?.scoredMark || ''}
                                                onChange={(e) => handleSubjectChange(marksheet._id, subject.code, 'scoredMark', e.target.value)}
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
                                            rows={4} 
                                            value={formInput[marksheet._id]?.toAddress || ''}
                                            onChange={(e) => handleInputChange(marksheet._id, 'toAddress', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={formInput[marksheet._id]?.remarks || 'Work Hard. Study well and can do better'}
                                            onChange={(e) => handleInputChange(marksheet._id, 'remarks', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleSubmitStudent(marksheet._id)}
                                        >
                                            Update
                                        </Button>
                                        <Button variant="danger" className='del' onClick={(e) => { e.preventDefault(); handleDelete(marksheet._id); }}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                ))
            )}
            <Button variant="primary" onClick={handleUpdateAll}>
                Update All
            </Button>
        </Container>
    );
};

export default TableComponent;




import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance'; // Ensure this is the correct Axios instance
import { Table, Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const TableComponent = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formInput, setFormInput] = useState({}); // For handling user inputs

    const { t_nm} = useParams();
    // Fetch all marksheets on component mount
    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
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
    }, [t_nm]);

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


    const handleDelete = async (id) => {
        try {
            await axios.delete(`/marksheets/${id}`);
            setMarksheets(marksheets.filter(template => template._id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
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
                                            Update
                                        </Button>
                                        <Button variant="danger del"  onClick={(e) => { e.preventDefault(); handleDelete(marksheet._id); }}>
                                                Delete
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