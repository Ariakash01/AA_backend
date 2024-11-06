import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Container, Table as BootstrapTable, Spinner,Alert } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import '../App.css'
import logoo from '../logoo.png'
const Marksheet = ({user}) => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t_nm } = useParams();
    const [isDownloading, setIsDownloading] = useState(false);
    const pdfRef = useRef(null); 
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        setIsDownloading(true);
        const element = pdfRef.current;
        const options = {
            filename: 'All_Marksheets.pdf',
            jsPDF: { unit: 'pt', format: 'a4' },
            html2canvas: { scale:2 },
            margin: [20, 10],
        };
        html2pdf().set(options).from(element).save().then(() => {
            setLoading(false);
            setIsDownloading(false); 
         
        });
    };

    const handleDownloadSingle = (marksheet) => {
        setLoading(true);
        setIsDownloading(true);
        const element = document.getElementById(`marksheet-${marksheet._id}`);
        const options = {
            filename: `${marksheet.stu_name}_Marksheet.pdf`,
            jsPDF: { unit: 'pt', format: 'a4' },
            html2canvas: { scale: 2 },
            margin: [20, 10],
        };
        html2pdf().set(options).from(element).save().then(() => {
            setLoading(false);
            setIsDownloading(false); 
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
        <div className={loading ? 'loading' : ''}>
             {loading && (
                <div className="overlay">
                    <Spinner animation="border"  id='sspp' />
                </div>
            )}
<h2 className="my-4">Marksheets</h2>
<h4 className="my-4 ctre">{t_nm}</h4>

{!isDownloading && (
         <div className='btnn'>
          {/*  <Button variant="primary" className="mb-3  " onClick={ handleUpdateRanks }>Rank</Button>  */} 

            <Button variant="success" className="mb-3 ml-3" onClick={handleDownloadAll}>Download All as PDF</Button>
          </div>
)}
        <Container ref={pdfRef} id="all_down" >
            
            {
            marksheets.map(marksheet => (
                <div className='cont_ner'>
                <Card key={marksheet._id} id={`marksheet-${marksheet._id}`} className="mb-4 overr">
                {!isDownloading && (
                <div className='btnn'>
                  <Button variant="primary" className="mb-1 btn" onClick={() => handleDownloadSingle(marksheet)}>Download Marksheet</Button>
              </div>

                )}
                
                     <div className="mb-4 bord" >
                    <Card.Body>
                      
                        <Card.Text>
                            <div className='logo'>
                            <img src={user.imagePath||logoo} width={50} height={50}></img>
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
                               <span className='lf_part medi_only'>: {marksheet.sem}</span>
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
                    <div className='adr side'>
                        <div className='adress bbor'>
                          <h6>
From                          </h6>
                        <p className='addre mve'>
                              {marksheet.fromAddress}
                          </p>
                        </div>
                        <div className='adress bbor'>
                          <h6>
                            To
                          </h6>
                          <p className='addre mve'>
                            {marksheet.toAddress}
                            </p>
                        </div>
                        <div className='adress stamps'>
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






