import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import axios from '../api/axiosInstance';

const Home = ({ user }) => {
    const [templates, setTemplates] = useState([]);
    const [name, setName] = useState([]);
    const [marksheetData, setMarksheetData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (user) {
                try {
                    const res = await axios.get(
                        `https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/marksheets/ms/${user._id}`
                    );
                    setTemplates(res.data);

                    const uniqueNames = new Set();
                    res.data.forEach((marksheet) => uniqueNames.add(marksheet.testName));
                    const uniqueNameArray = Array.from(uniqueNames);
                    setName(uniqueNameArray);
                } catch (error) {
                    console.error('Error fetching templates:', error);
                }
            }
        };

        const fetchMarksheetsByTemplates = async () => {
            const tempData = {};

            for (const t_nm of name) {
                try {
                    const res = await axios.get(`/marksheets/marksheet/${t_nm}/${user._id}`);
                    const marksheets = res.data;

                    // Calculate pass and fail
                    let totalPass = 0;
                    let totalFail = 0;
                    const subjectWise = {};

                    marksheets.forEach((marksheet) => {
                        marksheet.subjects.forEach((subject) => {
                            if (!subjectWise[subject.name]) {
                                subjectWise[subject.name] = { pass: 0, fail: 0 };
                            }

                            if (marksheet.status === 'Pass') {
                                totalPass += 1;
                                subjectWise[subject.name].pass += 1;
                            } else {
                                totalFail += 1;
                                subjectWise[subject.name].fail += 1;
                            }
                        });
                    });

                    tempData[t_nm] = {
                        totalPass,
                        totalFail,
                        subjectWise,
                    };
                } catch (error) {
                    console.error(`Error fetching marksheets for template ${t_nm}:`, error);
                }
            }

            setMarksheetData(tempData);
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchTemplates();
            await fetchMarksheetsByTemplates();
            setLoading(false);
        };

        fetchData();
    }, [user]);

    return (
        <Container className="mt-4">
            <h3 className="text-center">
                {user?.college || 'Dr. Sivanthi Aditanar College of Engineering, Tiruchendur'}
            </h3>
            <h4 className="text-center">{user?.dept || 'Information Technology'}</h4>
            <h5 className="text-center">Welcome, <strong>{user?.name}</strong>!</h5>

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






/*
import React from 'react';

const Home = ({user}) => {
    return (
        <div>
          {
            user?
          
          <>
            <h3 className='cnte'>{user.college||"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h3>
            <h4 className='cnte'>{user.dept||"Information Technology"}</h4>
            
           <h5>  Welcome's You <strong>{user.name}</strong></h5>
           </>
            :
            <>
                <h3 className='cnte'>{"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h3>
                <h4 className='cnte'>{"Marksheet Web Portal"}</h4>  
                </>
        }
        </div>
    );
};

export default Home;
*/
