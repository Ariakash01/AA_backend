import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Common = ({user}) => {
    const [formData, setFormData] = useState({
        templateName: '',
        college: 'Dr. Sivanthi Aditanar College of Engineering , Tiruchendur',
        department: 'Information Technology',
        testName: 'Periodical Test 1',
        year: '',
        oddEven: '',
        sem: '',
        date: '',
        classSem: '',
        subjects: [{ name: '', code: '' }],
        totalMark: 100,
        passingMark: 50,
        fromDate: '',
        toDate: '',
        remarks: 'Work Hard. Study well and can do better',
        total_class:'',
        advisorName: '',
        hodName: '',
        fromAddress: 'The Principal Dr. Sivanthi Aditanar College of Engineering, Tirunelveli Road, Tiruchendur - 628 215',
        noOfStudents:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, e) => {
        const { name, value } = e.target;
        const newSubjects = [...formData.subjects];
        newSubjects[index][name] = value;
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const addSubject = () => {
        setFormData(prev => ({ ...prev, subjects: [...prev.subjects, { name: '', code: '' }] }));
    };

    const removeSubject = (index) => {
        const newSubjects = [...formData.subjects];
        newSubjects.splice(index, 1);
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { noOfStudents, ...dataToSend } = formData;
    
        try {
          
            for (let i = 0; i < parseInt(noOfStudents); i++) {
                const studentData = {
                    ...dataToSend,
                    studentNumber: i + 1, 
                };
    
             
                await axios.post('/marksheets', studentData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
    
            alert(`${noOfStudents} templates created successfully`);
        } catch (error) {
            console.error('Error creating template:', error);
            alert(error.response?.data?.message || 'Failed to create template');
        }
    };
    

    return (
        <Container>
            <h2 className="my-4">Create Template</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Template Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="templateName"
                                value={formData.templateName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>College</Form.Label>
                            <Form.Control
                                type="text"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Test Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="testName"
                                value={formData.testName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Odd or Even</Form.Label>
                            <Form.Select
                                name="oddEven"
                                value={formData.oddEven}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Odd">Odd</option>
                                <option value="Even">Even</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Year and Sem</Form.Label>
                            <Form.Control
                                type="text"
                                name="sem"
                                value={formData.sem}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Class & Sem</Form.Label>
                            <Form.Control
                                type="text"
                                name="classSem"
                                value={formData.classSem}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                
                <h4>Subjects</h4>
                {formData.subjects.map((subject, index) => (
                    <Row key={index} className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Subject Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={subject.name}
                                    onChange={(e) => handleSubjectChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Subject Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="code"
                                    value={subject.code}
                                    onChange={(e) => handleSubjectChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Button variant="danger" onClick={() => removeSubject(index)}>Remove</Button>
                        </Col>
                    </Row>
                ))}
                <Button variant="primary" onClick={addSubject} className="mb-3">Add Subject</Button>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Mark</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalMark"
                                value={formData.totalMark}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Passing Mark</Form.Label>
                            <Form.Control
                                type="number"
                                name="passingMark"
                                value={formData.passingMark}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>From Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>To Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                                type="text"
                                name="remarks"
                                value={'Work Hard. Study well and can do better'}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Total CLass</Form.Label>
                
                                        <Form.Control
                                             type="number"
                                             name="total_class"
                                             value={formData.total_class}
                                             onChange={handleChange}
                                        />
                                
                                </Form.Group>
                                </Col>

                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Advisor Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="advisorName"
                                value={formData.advisorName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>HOD Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="hodName"
                                value={formData.hodName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. of Students</Form.Label>
                            <Form.Control
                                type="number"
                                name="noOfStudents"
                                value={formData.noOfStudents}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>From Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="fromAddress"
                                value={'The Principal Dr. Sivanthi Aditanar College of Engineering, Tirunelveli Road, Tiruchendur - 628 215'}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
{

user && 
                <Button variant="primary" type="submit">Create Template</Button>
}
            </Form>
        </Container>
    );
};

export default Common;
