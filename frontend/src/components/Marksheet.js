// frontend/src/components/Marksheet.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Table as BootstrapTable, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Marksheet = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const handleDownload = (marksheet) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Marksheet', 14, 22);
        doc.setFontSize(12);
        doc.text(`College: ${marksheet.college || 'Dummy College'}`, 14, 32);
        doc.text(`Department: ${marksheet.department || 'Dummy Department'}`, 14, 40);
        doc.text(`Test Name: ${marksheet.testName || 'Dummy Test'}`, 14, 48);
        doc.text(`Year: ${marksheet.year || 'Dummy Year'}, Odd/Even: ${marksheet.oddEven || 'Dummy'}`, 14, 56);
        doc.text(`Semester: ${marksheet.sem || 'Dummy Sem'}, Date: ${marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}`, 14, 64);
        doc.text(`Roll No: ${marksheet.rollNo || 'Dummy Roll No'}`, 14, 72);
        doc.text(`Name: ${marksheet.name || 'Dummy Name'}`, 14, 80);
        doc.text(`Year & Sem: ${marksheet.year}, ${marksheet.sem}`, 14, 88);

        // Subjects Table
        const subjects = marksheet.subjects.map(subject => ({
            subject: subject.name || 'Dummy Subject',
            code: subject.code || 'Dummy Code',
            totalMark: subject.totalMark || 0,
            passingMark: subject.passingMark || 0,
            scoredMark: subject.scoredMark || 0,
            result: (subject.scoredMark >= subject.passingMark) ? 'Pass' : 'Fail',
        }));

        doc.autoTable({
            head: [['Subject', 'Code', 'Total Mark', 'Passing Mark', 'Scored Mark', 'Result']],
            body: subjects.map(sub => [sub.subject, sub.code, sub.totalMark, sub.passingMark, sub.scoredMark, sub.result]),
            startY: 96,
        });

        // Summations and Additional Info
        const sumTotalMarks = subjects.reduce((sum, sub) => sum + (sub.totalMark || 0), 0);
        const sumScoredMarks = subjects.reduce((sum, sub) => sum + (sub.scoredMark || 0), 0);
        const rank = 1; // Implement rank calculation based on your logic

        doc.text(`Total Marks: ${sumTotalMarks}`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Scored Marks: ${sumScoredMarks}`, 14, doc.lastAutoTable.finalY + 18);
        doc.text(`Rank: ${rank}`, 14, doc.lastAutoTable.finalY + 26);
        doc.text(`Attendance Rate: ${marksheet.attendanceRate || 'Dummy Attendance'}`, 14, doc.lastAutoTable.finalY + 34);
        doc.text(`From Date: ${marksheet.fromDate ? new Date(marksheet.fromDate).toLocaleDateString() : 'Dummy From Date'}, To Date: ${marksheet.toDate ? new Date(marksheet.toDate).toLocaleDateString() : 'Dummy To Date'}`, 14, doc.lastAutoTable.finalY + 42);
        doc.text(`Remarks: ${marksheet.remarks || 'Dummy Remarks'}`, 14, doc.lastAutoTable.finalY + 50);
        doc.text(`Advisor Name: ${marksheet.advisorName || 'Dummy Advisor'}`, 14, doc.lastAutoTable.finalY + 58);
        doc.text(`HOD Name: ${marksheet.hodName || 'Dummy HOD'}`, 140, doc.lastAutoTable.finalY + 58);
        doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien nunc.', 14, doc.lastAutoTable.finalY + 66);
        doc.text(`From Address:\n${marksheet.fromAddress.split(',').join('\n')}`, 14, doc.lastAutoTable.finalY + 76);
        doc.text(`To Address:\n${marksheet.toAddress.split(',').join('\n')}`, 140, doc.lastAutoTable.finalY + 76);

        doc.save(`${marksheet.name || 'Dummy Name'}_Marksheet.pdf`);
    };

    const handleDownloadAll = () => {
        const doc = new jsPDF();
        marksheets.forEach((marksheet, index) => {
            if (index !== 0) doc.addPage();
            doc.setFontSize(18);
            doc.text('Marksheet', 14, 22);
            doc.setFontSize(12);
            doc.text(`College: ${marksheet.college || 'Dummy College'}`, 14, 32);
            doc.text(`Department: ${marksheet.department || 'Dummy Department'}`, 14, 40);
            doc.text(`Test Name: ${marksheet.testName || 'Dummy Test'}`, 14, 48);
            doc.text(`Year: ${marksheet.year || 'Dummy Year'}, Odd/Even: ${marksheet.oddEven || 'Dummy'}`, 14, 56);
            doc.text(`Semester: ${marksheet.sem || 'Dummy Sem'}, Date: ${marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}`, 14, 64);
            doc.text(`Roll No: ${marksheet.rollNo || 'Dummy Roll No'}`, 14, 72);
            doc.text(`Name: ${marksheet.name || 'Dummy Name'}`, 14, 80);
            doc.text(`Year & Sem: ${marksheet.year}, ${marksheet.sem}`, 14, 88);
    
            // Subjects Table
            const subjects = marksheet.subjects.map(subject => ({
                subject: subject.name || 'Dummy Subject',
                code: subject.code || 'Dummy Code',
                totalMark: subject.totalMark || 0,
                passingMark: subject.passingMark || 0,
                scoredMark: subject.scoredMark || 0,
                result: (subject.scoredMark >= subject.passingMark) ? 'Pass' : 'Fail',
            }));
    
            doc.autoTable({
                head: [['Subject', 'Code', 'Total Mark', 'Passing Mark', 'Scored Mark', 'Result']],
                body: subjects.map(sub => [sub.subject, sub.code, sub.totalMark, sub.passingMark, sub.scoredMark, sub.result]),
                startY: 96,
            });
    
            // Summations and Additional Info
            const sumTotalMarks = subjects.reduce((sum, sub) => sum + (sub.totalMark || 0), 0);
            const sumScoredMarks = subjects.reduce((sum, sub) => sum + (sub.scoredMark || 0), 0);
            const rank = 1; // Implement rank calculation based on your logic
    
            doc.text(`Total Marks: ${sumTotalMarks}`, 14, doc.lastAutoTable.finalY + 10);
            doc.text(`Scored Marks: ${sumScoredMarks}`, 14, doc.lastAutoTable.finalY + 18);
            doc.text(`Rank: ${rank}`, 14, doc.lastAutoTable.finalY + 26);
            doc.text(`Attendance Rate: ${marksheet.attendanceRate || 'Dummy Attendance'}`, 14, doc.lastAutoTable.finalY + 34);
            doc.text(`From Date: ${marksheet.fromDate ? new Date(marksheet.fromDate).toLocaleDateString() : 'Dummy From Date'}, To Date: ${marksheet.toDate ? new Date(marksheet.toDate).toLocaleDateString() : 'Dummy To Date'}`, 14, doc.lastAutoTable.finalY + 42);
            doc.text(`Remarks: ${marksheet.remarks || 'Dummy Remarks'}`, 14, doc.lastAutoTable.finalY + 50);
            doc.text(`Advisor Name: ${marksheet.advisorName || 'Dummy Advisor'}`, 14, doc.lastAutoTable.finalY + 58);
            doc.text(`HOD Name: ${marksheet.hodName || 'Dummy HOD'}`, 140, doc.lastAutoTable.finalY + 58);
            doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien nunc.', 14, doc.lastAutoTable.finalY + 66);
            doc.text(`From Address:\n${marksheet.fromAddress.split(',').join('\n')}`, 14, doc.lastAutoTable.finalY + 76);
            doc.text(`To Address:\n${marksheet.toAddress.split(',').join('\n')}`, 140, doc.lastAutoTable.finalY + 76);
        });
        doc.save('All_Marksheets.pdf');
    };

    if (marksheets.length === 0) {
        return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Marksheet not found</p>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="my-4">Marksheets</h2>
            <Button variant="success" className="mb-3" onClick={handleDownloadAll}>Download All as PDF</Button>
            {marksheets.map(marksheet => (
                <Card key={marksheet._id} className="mb-4">
                    <Card.Body>
                        <Card.Title>{marksheet.templateName}</Card.Title>
                        <Card.Text>
                            <p>College: {marksheet.college || 'Dummy College'}</p>
                            <p>Department: {marksheet.department || 'Dummy Department'}</p>
                            <p>Test Name: {marksheet.testName || 'Dummy Test'}, Year: {marksheet.year || 'Dummy Year'}, Odd/Even: {marksheet.oddEven || 'Dummy'}</p>
                            <p>Semester: {marksheet.sem || 'Dummy Sem'}, Date: {marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}</p>
                            <p>Roll No: {marksheet.rollno || 'Dummy Roll No'}</p>
                            <p>Name: {marksheet.stu_name || 'Dummy Name'}</p>
                            <p>Year & Sem: {marksheet.year}, {marksheet.sem}</p>
                        </Card.Text>
                        <BootstrapTable striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Code</th>
                                    <th>Total Mark</th>
                                    <th>Passing Mark</th>
                                    <th>Scored Mark</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksheet.subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td>{subject.name || 'Dummy Subject'}</td>
                                        <td>{subject.code || 'Dummy Code'}</td>
                                        <td>{subject.totalMark || 100}</td>
                                        <td>{subject.passingMark || 50}</td>
                                        <td>{subject.scoredMark || 0}</td>
                                        <td>{(subject.scoredMark >= subject.passingMark) ? 'Pass' : 'Fail'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </BootstrapTable>


                        

                        <Button variant="primary" onClick={() => handleDownload(marksheet)}>Download Marksheet</Button>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default Marksheet;
