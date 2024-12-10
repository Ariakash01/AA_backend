import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Container, Table as BootstrapTable, Spinner,Alert } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../App.css'
import logoo from '../logoo.png'
import Tamil from '../AAAA.png'

const Marksheet = ({user}) => {
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t_nm } = useParams();
    const [isDownloading, setIsDownloading] = useState(false);
    const pdfRef = useRef(null); 
    const [loading, setLoading] = useState(false);
  
    const chunkSize = 30; // Maximum marksheets per PDF
    useEffect(() => {
        const fetchMarksheets = async () => {
            try {
                const res = await axios.get(`/marksheets/marksheet/${t_nm}/${user._id}`);
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



   const handleDownloadAll = async () => {
    setIsDownloading(true);
    setLoading(true);

    try {
        const element = pdfRef.current;

        // Hide buttons from the PDF
        const buttons = element.querySelectorAll('.exclude-from-pdf');
        buttons.forEach((button) => (button.style.display = 'none'));

        // Get the full height of the content
        const contentHeight = element.scrollHeight;
        const pageHeight = 1108; // Approximate A4 page height in pixels (96 DPI)
        const maxPages = 29;
        const maxHeight = pageHeight * maxPages;

        // Determine the total number of chunks
        const totalChunks = Math.ceil(contentHeight / maxHeight);

        // Iterate through each chunk
        for (let i = 0; i < totalChunks; i++) {
            // Create a temporary container for the current chunk
            const chunkContainer = document.createElement('div');
            chunkContainer.style.position = 'relative';
            chunkContainer.style.height = `${maxHeight}px`;
            chunkContainer.style.overflow = 'hidden';

            // Clone the content and adjust for the current chunk
            const clonedElement = element.cloneNode(true);
            clonedElement.style.position = 'relative';
            clonedElement.style.top = `-${i * maxHeight}px`; // Offset content for the current chunk
            clonedElement.style.height = `${contentHeight}px`; // Set full height for accurate clipping
            clonedElement.style.overflow = 'hidden';

            // Append the visible part of the cloned content to the chunk container
            chunkContainer.appendChild(clonedElement);

            // Append the chunk container to the DOM (temporarily)
            document.body.appendChild(chunkContainer);

            // Generate the PDF for the current chunk
            const options = {
                filename: `Marksheets_Part_${i + 1}.pdf`,
                jsPDF: { unit: 'pt', format: 'a4' },
                html2canvas: { scale: 2 },
                margin: [20, 10],
            };

            await html2pdf().set(options).from(chunkContainer).save();

            // Remove the temporary chunk container
            document.body.removeChild(chunkContainer);
        }
    } catch (err) {
        setLoading(false);
        console.error('Error generating PDFs:', err);
        alert('Failed to generate PDFs. Please try again.');
    } finally {
        // Restore visibility and styles
       

        setLoading(false);
        setIsDownloading(false);
    }
};



/*
   const handleDownloadAll = async () => {
    setIsDownloading(true);
    setLoading(true);

    try {
        const element = pdfRef.current;

        // Hide buttons from the PDF
        const buttons = element.querySelectorAll('.exclude-from-pdf');
        buttons.forEach((button) => (button.style.display = 'none'));

        // Hide the element from user view while still keeping it in the DOM
   // Remove from the layout flow
        element.style.zIndex = '-1'; // Ensure it's not interactive

        // Estimate the total height of the content
        const contentHeight = element.scrollHeight;
        const pageHeight = 1108; // Approximate A4 page height in pixels (96 DPI)
        const maxPages = 29;
        const maxHeight = pageHeight * maxPages;

        // Determine the number of chunks needed
        const totalChunks = Math.ceil(contentHeight / maxHeight);

        for (let i = 0; i < totalChunks; i++) {
            // Create a temporary container for the chunk
            const chunkContainer = document.createElement('div');
            chunkContainer.style.height = `${maxHeight}px`;
            chunkContainer.style.overflow = 'hidden';

            // Clone and offset content for the current chunk
            const clonedElement = element.cloneNode(true);
            clonedElement.style.top = `-${i * maxHeight}px`; // Offset for chunk
            clonedElement.style.height = `${contentHeight}px`; // Maintain full height for calculations
            clonedElement.style.overflow = 'hidden';
            chunkContainer.appendChild(clonedElement);

            // Append the chunk container to the DOM (hidden from view)
            document.body.appendChild(chunkContainer);

            // Generate PDF for the current chunk
            const options = {
                filename: `Marksheets_Part_${i + 1}.pdf`,
                jsPDF: { unit: 'pt', format: 'a4' },
                html2canvas: { scale: 2 },
                margin: [20, 10],
            };

            await html2pdf().set(options).from(chunkContainer).save();

            // Clean up the temporary chunk container
            document.body.removeChild(chunkContainer);
        }
    } catch (err) {
        console.error('Error generating PDFs:', err);
        alert('Failed to generate PDFs. Please try again.');
    } finally {
        // Restore visibility and styles
        if (pdfRef.current) {
            const element = pdfRef.current;
            element.style.visibility = '';
            element.style.position = '';
            element.style.zIndex = '';
        }

        setLoading(false);
        setIsDownloading(false);
    }
};





   /*
   const handleDownloadAll = async () => {
    setIsDownloading(true);

    setLoading(true);

    try {
        const element = pdfRef.current;
        const buttons = element.querySelectorAll('.exclude-from-pdf');
        buttons.forEach((button) => (button.style.display = 'none'));
        // Estimate the total height of the content to decide the split
        const contentHeight = element.scrollHeight;
        const pageHeight = 1108;// Approximate height for one A4 page in px (for 96 DPI)
        const maxPages =29;
        const maxHeight = pageHeight * maxPages;
       
        // Determine the number of chunks needed
        const totalChunks = Math.ceil(contentHeight / maxHeight);

        for (let i = 0; i < totalChunks; i++) {
            // Create a temporary div to hold the content for the current chunk
            const chunkContainer = document.createElement('div');
            chunkContainer.style.height = `${maxHeight}px`;
            chunkContainer.style.overflow = 'hidden';

            // Clone the content for the current chunk
            const clonedElement = element.cloneNode(true);
            clonedElement.style.position = 'absolute';
            clonedElement.style.top = `-${i * maxHeight}px`; // Offset to start the chunk
            clonedElement.style.height = `${contentHeight}px`; // Ensure full height for calculations
            clonedElement.style.overflow = 'hidden';
            chunkContainer.appendChild(clonedElement);

            // Add the temporary container to the DOM (hidden)
            document.body.appendChild(chunkContainer);

            // Generate PDF for the current chunk
            const options = {
                filename: `Marksheets_Part_${i + 1}.pdf`,
                jsPDF: { unit: 'pt', format: 'a4' },
                html2canvas: { scale: 2 },
                margin: [20,10],
            };

            await html2pdf().set(options).from(chunkContainer).save();

            // Remove the temporary container from the DOM
            document.body.removeChild(chunkContainer);
        }
    } catch (err) {
        console.error('Error generating PDFs:', err);
        alert('Failed to generate PDFs. Please try again.');
    } finally {
        setLoading(false);
        setIsDownloading(false);
    }
};


  

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

*/
    

    const handleDownloadSingle = (marksheet) => {
        setLoading(true);
        setIsDownloading(true);
        const element = document.getElementById(`marksheet-${marksheet._id}`);
        const options = {
            filename: `${marksheet.stu_name}_Marksheet.pdf`,
            jsPDF: { unit: 'pt', format: 'a4' },
            html2canvas: { scale: 2 },
            margin: [0, 0,0,0],
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
                    <Spinner animation="border" id='sspp' />
                </div>
            )}
<h2 className="my-4">Marksheets</h2>
<h4 className="my-4 ctre">{t_nm}</h4>
<p className="my-4 ctre">{marksheets.length} Marksheet(s) Found</p>
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
                  <Button variant="primary" className="exclude-from-pdf   mb-1 btn" onClick={() => handleDownloadSingle(marksheet)}>Download Marksheet</Button>
              </div>

                )}
                     <div className="mb-4 bord" >
                    <Card.Body>
                      
                        <Card.Text>
                            <div className='logo'>
                            <img src={logoo} width={50} height={50} className='logo_img'></img>
                            <div className='right'>
                           
                            <h6 className='centre clg'> {marksheet.college || 'Dummy College'}</h6>
                            <p className='centre dep'> Department Of {marksheet.department || 'Dummy Department'}</p>
                            <p className='centre rd3 '> {marksheet.testName || 'Dummy Test'} Progress Report : {marksheet.year || 'Dummy Year'}({marksheet.oddEven || 'Dummy'} SEMESTER)</p>
                            <div className='dt'>
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
                               <span className='lf_part medi_only'>: {marksheet.classSem}</span>
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
                                <span className=' medi gp'> {marksheet.attendance}%</span>
                               
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
                          <p className='madam'>
                              {marksheet.advisorName}
                          </p>
                        </div>
                        <div className='mamm'>
                          <strong>
                            HOD
                          </strong>
                          <p className='madam'>
                            {marksheet.hodName}
                            </p>
                        </div>
                  </div>

                <p className='para_tam'>
                    <img src={Tamil}></img>
                </p>
               

                       
                    </Card.Body>

                    </div>
                    <div className='adr side'>
                        <div className='adress bbor'>
                          <p className='fnt'>
From                          </p>
                        <p className='addre mve'>
                              {marksheet.fromAddress}
                          </p>
                        </div>
                        <div className='adress bbor'>
                          <p className='fnt'>
                            To
                          </p >
                          <p className='addre mve'>
                            {marksheet.toAddress}
                            </p>
                        </div>
                        <div className='adress stamps'>
                            <p className='fnt'>
                                STAMP
                            </p >
                            <div className='stamp'>
                                  
                            </div>
                        </div>
                  </div>


                 <div className='btnn'>


                    </div>
                </Card>
                


                </div>

            ))}

     </Container>
        </div>
    );
};

export default Marksheet;






