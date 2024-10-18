import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Marksheet.css"; // Link to your custom CSS file

const MarksheetFormat = ({ structureId }) => {
  const [marksData, setMarksData] = useState([]);
  const [subjectNames, setSubjectNames] = useState([]);
  const [date, setDate] = useState('');
  const contentRef = useRef();

  // Fetch data when component loads
  useEffect(() => {
    axios.get(`/api/marksheet/${structureId}`)
      .then(response => {
        setMarksData(response.data.marks);
        setSubjectNames(response.data.subjects);
        setDate(response.data.date);
      })
      .catch(error => console.error("Error fetching marks data:", error));
  }, [structureId]);

  // PDF Generation
  const generatePDF = () => {
    const options = {
      margin: 0.5,
      filename: 'marksheet.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(contentRef.current).set(options).save();
  };

  return (
    <div className="container">
      <div ref={contentRef} className="marksheet-container mt-5 p-4 shadow-lg rounded">
        <div className="text-center">
          <h2>Dr. Sivanthi Aditanar College of Engineering</h2>
          <h4>Department of Information Technology</h4>
          <h5>Periodical Test - I Progress Report</h5>
          <p>Date: {date}</p>
        </div>

        {marksData.length > 0 && (
          <div>
            <p>Roll No: {marksData[0].rollNo}</p>
            <p>Name: {marksData[0].studentName}</p>
            <p>Class & Sem: II IT & III</p>
            <hr />
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Subject Name with Code</th>
                  <th>Total</th>
                  <th>Passing</th>
                  <th>Scored</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {marksData[0].marks.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>Total: 100</td>
                    <td>Passing: 50</td>
                    <td>Scored: {subject.scored}</td>
                    <td>Result: {subject.scored < 50 ? 'Fail' : 'Pass'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <div>
              <p>Total Marks: {marksData[0].totalMarks}</p>
              <p>Attendance Percentage: {marksData[0].attendancePercentage}%</p>
              <p>Rank: {marksData[0].rank}</p>
              <p>Remarks: Work Hard. Study well and can do better.</p>
              <p>Faculty Advisor: Miss. K.Rumya Thamizharasi, AP/IT</p>
              <p>HOD: Dr. S.Selvi, Prof & HOD</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-primary" onClick={generatePDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default MarksheetFormat;
