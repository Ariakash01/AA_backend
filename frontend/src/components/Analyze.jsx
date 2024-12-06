import React , { useEffect, useState }from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../App.css'
const Home = ({ user, templates, marksheetData, loading, name }) => {
    const [total,setTotal]=useState(0);
    return (
        <Container className="mt-4" variany="primary">
            <h3 >
                Students Overview
            </h3>
            

            {loading ? (
                <div className="text-center mt-5">
                    <span className="spinner-border" role="status"></span>
                </div>
            ) : (
                <>
                    <Row className="mt-4">
                        {name.map((templateName) => {
                            const subjectWiseData = marksheetData[templateName]?.subjectWise || {};

                            // Prepare data for the bar chart
                            const chartData = {
                                labels: Object.keys(subjectWiseData),
                                datasets: [
                                    {
                                        label: 'Pass %',
                                        data: Object.keys(subjectWiseData).map(
                                            (subject) =>
                                                ((subjectWiseData[subject].pass /
                                                    (subjectWiseData[subject].pass +
                                                        subjectWiseData[subject].fail)) *
                                                    100).toFixed(2)
                                        ),
                                        backgroundColor: '#28a745',
                                    },
                                    {
                                        label: 'Fail %',
                                        data: Object.keys(subjectWiseData).map(
                                            (subject) =>
                                                ((subjectWiseData[subject].fail /
                                                    (subjectWiseData[subject].pass +
                                                        subjectWiseData[subject].fail)) *
                                                    100).toFixed(2)
                                        ),
                                        backgroundColor: '#dc3545',
                                    },
                                ],
                            };

                            return (
                                <Col md={12} key={templateName} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="text-center">{templateName}</Card.Title>
                                            <Row>
                                                {/* Left Side: Graph */}
                                                <Col md={6}>
                                                    <div className="chart-container mb-3">
                                                        <Bar
                                                            data={chartData}
                                                            options={{
                                                                responsive: true,
                                                                plugins: {
                                                                    legend: { position: 'top' },
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </Col>

                                                {/* Right Side: Table */}
                                                <Col md={6}>
                                                    <Table bordered>
                                                        <thead>
                                                            <tr>
                                                                <th>Subject</th>
                                                                <th>Pass</th>
                                                                <th>Fail</th>
                                                                <th>Pass %</th>
                                                                <th>Fail %</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.keys(subjectWiseData).map((subject) => {
                                                                const { pass, fail } = subjectWiseData[subject];
                                                                const total = pass + fail;
                                                                return (
                                                                    <tr key={subject}>
                                                                        <td>{subject}</td>
                                                                        <td>{pass}</td>
                                                                        <td>{fail}</td>
                                                                        <td>{((pass / total) * 100).toFixed(2)}%</td>
                                                                        <td>{((fail / total) * 100).toFixed(2)}%</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                            <p>Total Pass: {marksheetData[templateName]?.totalPass || 0}</p>
                                            <p>Total Fail: {marksheetData[templateName]?.totalFail || 0}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Home;






/*import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import axios from '../api/axiosInstance';

const Home = ({ user ,templates ,marksheetData,loading,name,rel}) => {
 
 
    return (
        <Container className="mt-4">
            

            {loading ? (
                <div className="text-center mt-5">
                    <span className="spinner-border" role="status"></span>
                </div>
            ) : (
                <>
                    <Row className="mt-4">
                        {name.map((templateName) => (
                            <Col md={6} key={templateName} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{templateName}</Card.Title>
                                        <p>Total Pass: {marksheetData[templateName]?.totalPass || 0}</p>
                                        <p>Total Fail: {marksheetData[templateName]?.totalFail || 0}</p>

                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Pass</th>
                                                    <th>Fail</th>
                                                    <th>Pass %</th>
                                                    <th>Fail %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {marksheetData[templateName]?.subjectWise &&
                                                    Object.keys(marksheetData[templateName].subjectWise).map(
                                                        (subject) => {
                                                            const { pass, fail } =
                                                                marksheetData[templateName].subjectWise[subject];
                                                            const total = pass + fail;
                                                            return (
                                                                <tr key={subject}>
                                                                    <td>{subject}</td>
                                                                    <td>{pass}</td>
                                                                    <td>{fail}</td>
                                                                    <td>{((pass / total) * 100).toFixed(2)}%</td>
                                                                    <td>{((fail / total) * 100).toFixed(2)}%</td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Home;
*/
