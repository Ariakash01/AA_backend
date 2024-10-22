// frontend/src/components/MarksheetView.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Table as BootstrapTable, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MarksheetView = () => {
    const { id } = useParams();
    const [marksheet, setMarksheet] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarksheet = async () => {
            try {
                const res = await axios.get(`/marksheets/${id}`);
                setMarksheet(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheet');
            }
        };
        fetchMarksheet();
    }, [id]);

    const handleDownload = () => {
        if (!marksheet) return;

        const doc = new jsPDF();

        // Add content to PDF as per requirements
        doc.setFontSize(18);
        doc.text('Marksheet', 105, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.text(`College: ${marksheet.college || 'Dummy College'}`, 14, 30);
        doc.text(`Department: ${marksheet.department || 'Dummy Department'}`, 14, 40);
        doc.text(`Test Name: ${marksheet.testName || 'Dummy Test'}, Year: ${marksheet.year || 'Dummy Year'}, Odd/Even: ${marksheet.oddEven || 'Dummy'}`, 14, 50);
        doc.text(`Semester: ${marksheet.sem || 'Dummy Sem'}, Date: ${marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}`, 14, 60);
        doc.text(`Roll No: ${marksheet.rollNo || 'Dummy Roll No'}`, 14, 70);
        doc.text(`Name: ${marksheet.name || 'Dummy Name'}`, 14, 80);
        doc.text(`Year & Sem: ${marksheet.year}, ${marksheet.sem}`, 14, 90);

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
            startY: 100,
        });

        // Summations and Additional Info
        const sumTotalMarks = subjects.reduce((sum, sub) => sum + (sub.totalMark || 0), 0);
        const sumScoredMarks = subjects.reduce((sum, sub) => sum + (sub.scoredMark || 0), 0);
        const rank = 1; // Implement rank calculation based on your logic

        doc.text(`Total Marks: ${sumTotalMarks}`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Scored Marks: ${sumScoredMarks}`, 14, doc.lastAutoTable.finalY + 20);
        doc.text(`Rank: ${rank}`, 14, doc.lastAutoTable.finalY + 30);
        doc.text(`Attendance Rate: ${marksheet.attendanceRate || 'Dummy Attendance'}`, 14, doc.lastAutoTable.finalY + 40);
        doc.text(`From Date: ${marksheet.fromDate ? new Date(marksheet.fromDate).toLocaleDateString() : 'Dummy From Date'}, To Date: ${marksheet.toDate ? new Date(marksheet.toDate).toLocaleDateString() : 'Dummy To Date'}`, 14, doc.lastAutoTable.finalY + 50);
        doc.text(`Remarks: ${marksheet.remarks || 'Dummy Remarks'}`, 14, doc.lastAutoTable.finalY + 60);
        doc.text(`Advisor Name: ${marksheet.advisorName || 'Dummy Advisor'}`, 14, doc.lastAutoTable.finalY + 70);
        doc.text(`HOD Name: ${marksheet.hodName || 'Dummy HOD'}`, 140, doc.lastAutoTable.finalY + 70);
        doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien nunc.', 14, doc.lastAutoTable.finalY + 80);
        doc.text(`From Address:\n${marksheet.fromAddress.split(',').join('\n')}`, 14, doc.lastAutoTable.finalY + 90);
        doc.text(`To Address:\n${marksheet.toAddress.split(',').join('\n')}`, 140, doc.lastAutoTable.finalY + 90);

        doc.save(`${marksheet.name || 'Dummy Name'}_Marksheet.pdf`);
    };

    if (error) {
        return (
            <Container>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!marksheet) {
        return (
            <Container>
                <p>Loading...</p>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="my-4">Marksheet Details</h2>
            <Card>
                <Card.Body>
                    <Card.Title>{marksheet.templateName}</Card.Title>
                    <Card.Text>
                        <p>College: {marksheet.college || 'Dummy College'}</p>
                        <p>Department: {marksheet.department || 'Dummy Department'}</p>
                        <p>Test Name: {marksheet.testName || 'Dummy Test'}, Year: {marksheet.year || 'Dummy Year'}, Odd/Even: {marksheet.oddEven || 'Dummy'}</p>
                        <p>Semester: {marksheet.sem || 'Dummy Sem'}, Date: {marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}</p>
                        <p>Roll No: {marksheet.rollNo || 'Dummy Roll No'}</p>
                        <p>Name: {marksheet.name || 'Dummy Name'}</p>
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
                    <Button variant="primary" onClick={handleDownload}>Download Marksheet</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MarksheetView;
