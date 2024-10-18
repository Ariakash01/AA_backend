import React, { useState } from 'react';
import marksheetService from '../../services/marksheetService';

const EntryMark = ({ structureId, numberOfStudents, subjects }) => {
  const [marksData, setMarksData] = useState(
    Array(numberOfStudents).fill().map(() => ({
      studentName: '',
      rollNo: '',
      marks: Array(subjects.length).fill(0),
    }))
  );

  const handleChange = (studentIndex, subjectIndex, value) => {
    const newMarksData = [...marksData];
    newMarksData[studentIndex].marks[subjectIndex] = value;
    setMarksData(newMarksData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    marksheetService.saveMarks(structureId, marksData)
      .then((res) => alert('Marks submitted successfully!'))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {marksData.map((student, studentIndex) => (
          <div key={studentIndex}>
            <input 
              type="text" 
              value={student.studentName} 
              onChange={(e) => handleChange(studentIndex, null, e.target.value)} 
              placeholder="Student Name" 
            />
            <input 
              type="text" 
              value={student.rollNo} 
              onChange={(e) => handleChange(studentIndex, null, e.target.value)} 
              placeholder="Roll No" 
            />
            {subjects.map((subject, subjectIndex) => (
              <input 
                type="number" 
                key={subjectIndex} 
                value={marksData[studentIndex].marks[subjectIndex]} 
                onChange={(e) => handleChange(studentIndex, subjectIndex, e.target.value)} 
                placeholder={`Marks for ${subject.name}`} 
              />
            ))}
          </div>
        ))}
        <button type="submit">Submit Marks</button>
      </form>
    </div>
  );
};

export default EntryMark;
