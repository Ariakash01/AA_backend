// frontend/src/components/Marksheet.js

// frontend/src/components/Marksheet.js
import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Container, Table as BootstrapTable, Alert } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import '../App.css'
import logoo from '../logoo.png'
const Marksheet = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t_nm } = useParams();
    const [isDownloading, setIsDownloading] = useState(false);
    const pdfRef = useRef(null); // Reference for downloading all marksheets

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
                setMarksheets(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, [t_nm]);


    {/*      For rank buttonku

    const fetchMarksheets = async () => {
        try {
            const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
            setMarksheets(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch marksheets');
        }
    };


    const handleUpdateRanks = async () => {
        try {
            const res = await axios.post('/marksheets/update_ranks');
            fetchMarksheets(); // Refresh ranks after updating
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update ranks');
        }
    };
    useEffect(() => {
        fetchMarksheets();
    }, []);
    */} 

    const handleDownloadAll = () => {
        setIsDownloading(true);
        const element = pdfRef.current;
        const options = {
            filename: 'All_Marksheets.pdf',
            jsPDF: { unit: 'pt', format: 'a4' },
            html2canvas: { scale:2 },
            margin: [20, 10],
        };
        html2pdf().set(options).from(element).save().then(() => {
            setIsDownloading(false); // Show button again after download completes
        });
    };

    const handleDownloadSingle = (marksheet) => {
        setIsDownloading(true);
        const element = document.getElementById(`marksheet-${marksheet._id}`);
        const options = {
            filename: `${marksheet.stu_name}_Marksheet.pdf`,
            jsPDF: { unit: 'pt', format: 'a4' },
            html2canvas: { scale: 2 },
            margin: [20, 10],
        };
        html2pdf().set(options).from(element).save().then(() => {
            setIsDownloading(false); // Show button again after download completes
        });
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
        <div>

<h4 className="my-4">{t_nm} Marksheets</h4>


         <div className='btnn'>
          {/*  <Button variant="primary" className="mb-3  " onClick={ handleUpdateRanks }>Rank</Button>  */} 

            <Button variant="success" className="mb-3 ml-3" onClick={handleDownloadAll}>Download All as PDF</Button>
          </div>
        <Container ref={pdfRef} >
            
            {
            marksheets.map(marksheet => (
                <div className='cont_ner'>
                <Card key={marksheet._id} id={`marksheet-${marksheet._id}`} className="mb-4">
                {!isDownloading && (
                <div className='btnn'>
                  <Button variant="primary" className="mb-1 btn" onClick={() => handleDownloadSingle(marksheet)}>Download Marksheet</Button>
              </div>

                )}
                
                     <div className="mb-4 bord" >
                    <Card.Body>
                      
                        <Card.Text>
                            <div className='logo'>
                            <img src={logoo} width={85} height={85}></img>
                            <div className='right'>
                           
                            <h6 className='centre clg'> {marksheet.college || 'Dummy College'}</h6>
                            <p className='centre dep'> Department Of {marksheet.department || 'Dummy Department'}</p>
                            <p className='centre rd3 '> {marksheet.testName || 'Dummy Test'} Progress Report : {marksheet.year || 'Dummy Year'}({marksheet.oddEven || 'Dummy'} SEMESTER)</p>
                            <div className='dt'>
                            <p className='centre fourth'> Year & Sem :{marksheet.sem || 'Dummy Sem'} </p>
                            <p className='date medi'>Date : {marksheet.date ? new Date(marksheet.date).toLocaleDateString() : 'Dummy Date'}</p>
                            </div>
                            </div>
                            </div>
                           
                           <div className='lf_part_varr'> 
                            <span className='lf_part_var medi_only'>Roll No  </span>
                               <span className='lf_part medi_only'>: {marksheet.rollno || 'Dummy Roll No'}</span>
                               </div>
                               <div className='lf_part_varr'>
                            <span className='lf_part_var medi_only'>Student Name  </span>
                               <span className='lf_part medi_only'>: {marksheet.stu_name || 'Dummy Name'}</span>
                               </div>
                               <div className='lf_part_varr'>
                            <span className='lf_part_var medi_only'>Class & Sem </span>
                               <span className='lf_part medi_only'>: {marksheet.year}, {marksheet.sem}</span>
                               </div>
                        </Card.Text>
                        <table  bordered className='bdr tbl'>
                            <thead>
                                <tr  className=' tdd'>
                                    <th className=' tdd medi'>Subject</th>
                                    <th className=' tdd medi'>Code</th>
                                    <th className=' tdd medi'>Total Mark</th>
                                    <th className=' tdd medi'>Passing Mark</th>
                                    <th className=' tdd medi'>Scored Mark</th>
                                    <th className=' tdd medi'>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksheet.subjects.map((subject, index) => (
                                    <tr key={index} className=' tdd' >
                                        <td className=' tdd medi_only'>{subject.name || 'Dummy Subject'}</td>
                                        <td className=' tdd  medi'>{subject.code || 'Dummy Code'}</td>
                                        <td className=' tdd medi'>{subject.totalMark || 100}</td>
                                        <td className=' tdd medi'>{subject.passingMark || 50}</td>
                                        <td className=' tdd medi'>{subject.scoredMark<0?'AB':subject.scoredMark || 0}</td>
                                        <td className=' tdd medi'>{subject.scoredMark<0?'AB':(subject.scoredMark >= subject.passingMark) ? 'Pass' : 'Fail'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className='marks_cal tab'  >
                            
                            <tr className='marks_cal'>
                                <td className=' td medi'>Total Marks</td>
                                <td className='marks_cal td medi'>{marksheet.sum_total_mark}</td>
                            </tr>
                            <tr className='marks_cal'>
                                <td className='marks_cal td  medi'>Scored Marks</td>
                                <td className='marks_cal td  medi'>{marksheet.sum_scored_mark}</td>
                               
                            </tr>
                            <tr className='marks_cal'>
                                <td className='marks_cal td medi'>Rank</td>
                                <td className='marks_cal td medi'>{marksheet.status=="Pass"?marksheet.rank:marksheet.status=="AB"?marksheet.status:"-"}</td>
                            </tr>
                          
                            </table>

                            <div className='below'>
                                <span className=' medi'>Attendance Percentage</span>
                                <span className=' medi gp'> {marksheet.attendanceRate}%</span>
                               
                                <span className=' medi gp'>From :{marksheet.fromDate? new Date(marksheet.fromDate).toLocaleDateString() : 'Dummy Date'}</span>
                             
                                <span className=' medi'>To :{marksheet.toDate? new Date(marksheet.toDate).toLocaleDateString() : 'Dummy Date'}</span>
                                
                            </div>
                            <div className='rem'>
                            <p className='remark medi'>Remarks</p>
                            <p className='wrap medi'>{marksheet.remarks}</p>
                            </div>
                 <div className='mam'>
                        <div className='mamm'>
                          <strong>
                            FACULTY ADVISOR
                          </strong>
                          <h6>
                              {marksheet.advisorName}
                          </h6>
                        </div>
                        <div className='mamm'>
                          <strong>
                            HOD
                          </strong>
                          <h6>
                            {marksheet.hodName}
                            </h6>
                        </div>
                  </div>

                <p className='para_tam'>
                என்னுடைய மகன்/மகள் வகுப்பு தேர்ச்சியை அறிந்து கொண்டேன். அடுத்த தேர்வில் நல்ல முறையில் தேர்ச்சி பெற அறிவுரை கூறுகிறேன். இத்துடன் இந்த தேர்ச்சி அறிக்கையை திருப்பி அனுப்புகிறேன்.
                </p>
                <p className='para_tam'>
                என்னுடைய மகன்/மகள் வகுப்பு தேர்வுகள் அனைத்திலும் சேர்த்து குறைந்தபட்சம் 10% மதிப்பெண்களும் வருகை விழுக்காடு 75% பெற்றால் தான் பல்கலைக்கழக தேர்விற்கு அனுமதிக்கப்படுவார்கள் என்பதையும் நான் அறிவேன்.
                </p>
                <p className='sign'>
                பெற்றோர் கையொப்பம்
                </p>

                       
                    </Card.Body>

                    </div>
                    <div className='addr'>
                        <div className='address'>
                          <h6>
From                          </h6>
                        <p className='addre'>
                              {marksheet.fromAddress}
                          </p>
                        </div>
                        <div className='address'>
                          <h6>
                            To
                          </h6>
                          <p className='addre'>
                            {marksheet.toAddress}
                            </p>
                        </div>
                        <div className='stamps'>
                            <h6>
                                STAMP
                            </h6>
                            <div className='stamp'>
                                  
                            </div>
                        </div>
                  </div>


                 <div className='btnn'>


                    </div>
                </Card>
                


                </div>

            ))}

{!isDownloading && (
<div className='btnn'>
<Button variant="success" className="mb-2  btn" onClick={handleDownloadAll}>Download All as PDF</Button>
</div>
)}
        </Container>
        </div>
    );
};

export default Marksheet;






{/*
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Container, Table as BootstrapTable, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Marksheet = () => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { t_nm} = useParams();

    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}`);
                
                setMarksheets(res.data);
               
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marksheets');
            }
        };
        fetchMarksheets();
    }, [t_nm,marksheets]);

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


*/}