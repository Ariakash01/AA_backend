import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = ({ user, classStats, marksheetStats, loading }) => {
    // Calculate totals dynamically
    const totalStudents = classStats.reduce((acc, cls) => acc + cls.students, 0);
    const totalMarksheets = marksheetStats.reduce((acc, item) => acc + item.count, 0);

    return (
        <Container className="home-container">
            {!user&& 
             <Link to={'/login'}>
             <h5 className="text-center rred mb-3">Login To Continue</h5>
             </Link>
            }
            {/* Header Section */}
            <header className="home-header mb-4">
                <Row>
                    {/* Left: Welcome Text */}
                    <Col md={6} className="header-left">
                        <h3>Welcome's You <strong>{user?.name || 'Guest'}</strong></h3>
                        <p>Efficiently manage your students, classes, and reports.</p>
                    </Col>
                    
                    {/* Right: Dynamic Stats */}
                    <Col md={6} className="header-right ">
                        <Card className="mb-2" id="lf_to">
                            <Card.Body>
                                <span>Created Students</span>
                                <span className="stat-number">{totalStudents}</span>
                            </Card.Body>
                        </Card>
                        <Card id="lf_to">
                            <Card.Body>
                                <span>Generated Marksheets</span>
                                <span className="stat-number2">{totalMarksheets}</span>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </header>

            {loading ? (
                <div className="text-center">
                    <span className="spinner-border" role="status"></span>
                </div>
            ) : (
                <>
                    {/* Call-to-Action Section */}
                    <section className="call-to-action text-center mb-4">
                        <h3>Start Managing Today!</h3>
                        <p>Create new templates, manage marksheets, and generate detailed reports with ease.</p>
                        <Button variant="success" href="/template">
                            Create Template
                        </Button>
                    </section>

                    {/* Class Details Section */}
                    <section className="class-details mb-4">
                        <h3 className="text-center mb-3">Class Details</h3>
                        <Row>
                            {classStats.map((cls, index) => (
                                <Col md={4} key={index} className="mb-4">
                                    <Card id="class-card">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Card.Title id="he">{cls.className}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Students:</strong> {cls.students}
                                                    </Card.Text>
                                                </div>
                                                <div className="stat-icon">👩‍🎓</div>
                                            </div>
                                            <Link to={`/students/${cls.className}`} id="tx">
                                                <Button className="mt-3">View Students</Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            {!classStats.length &&
                            <p className="text-center mb-3">No classes Found</p>
                            }
                        </Row>
                    </section>

                    {/* Marksheet Details Section */}
                    <section className="marksheet-details mb-4">
                        <h3 className="text-center mb-3">Marksheet Details</h3>
                        <Row>
                            {marksheetStats.map((marksheet, index) => (
                                <Col md={4} key={index} className="mb-4">
                                    <Card id="marksheet-card">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Card.Title id="he">{marksheet.testName}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Marksheets:</strong> {marksheet.count}
                                                    </Card.Text>
                                                </div>
                                                <div className="stat-icon">📄</div>
                                            </div>
                                            <Link to={`/marksheets/${marksheet.testName}`} id="tx">
                                                <Button className="mt-3">View Marksheets</Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            {!marksheetStats.length &&
                            <p className="text-center mb-3">No Marksheets Found</p>
                            }
                        </Row>
                    </section>
                </>
            )}
        </Container>


    );
};

export default Home;
