import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Template.css';

const Template = ({ setStructureId }) => {
  const [formData, setFormData] = useState({
    department: '',
    periodicTest: '',
    year: '',
    sem: '',
    oddOrEven: '',
    date: '',
    subjects: [{ name: '' }],
    numberOfStudents: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (index, event) => {
    const newSubjects = formData.subjects.map((subject, sIndex) => {
      if (index === sIndex) {
        return { ...subject, [event.target.name]: event.target.value };
      }
      return subject;
    });
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({ ...formData, subjects: [...formData.subjects, { name: '' }] });
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, sIndex) => sIndex !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

 {/*} const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/marksheet/save', formData)
      .then((response) => {
        setStructureId(response.data.structure._id);
        alert('Form structure saved successfully');
      })
      .catch((err) => console.error(err));
  };     onSubmit={handleSubmit}   */}

  return (
    <div className="container p-3 mt-0 rounded temp">
      <h2 className="mb-4 text-center">Structure Form</h2>
      <form className="row g-3">
        
        {/* Department */}
        <div className="col-md-6">
          <label className="form-label">Department</label>
          <input 
            className="form-control" 
            type="text" 
            name="department" 
            value={formData.department} 
            onChange={handleInputChange} 
            placeholder="Enter department" 
            required 
          />
        </div>

        {/* Periodic Test */}
        <div className="col-md-6">
          <label className="form-label">Periodic Test</label>
          <input 
            className="form-control" 
            type="text" 
            name="periodicTest" 
            value={formData.periodicTest} 
            onChange={handleInputChange} 
            placeholder="Enter test name" 
            required 
          />
        </div>

        {/* Year */}
        <div className="col-md-4">
          <label className="form-label">Year</label>
          <input 
            className="form-control" 
            type="text" 
            name="year" 
            value={formData.year} 
            onChange={handleInputChange} 
            placeholder="Enter year" 
            required 
          />
        </div>

        {/* Semester */}
        <div className="col-md-4">
          <label className="form-label">Semester</label>
          <input 
            className="form-control" 
            type="text" 
            name="sem" 
            value={formData.sem} 
            onChange={handleInputChange} 
            placeholder="Enter semester" 
            required 
          />
        </div>

        {/* Odd or Even */}
        <div className="col-md-4">
          <label className="form-label">Odd or Even</label>
          <select 
            className="form-select" 
            name="oddOrEven" 
            value={formData.oddOrEven} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select</option>
            <option value="Odd">Odd</option>
            <option value="Even">Even</option>
          </select>
        </div>

        {/* Date */}
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input 
            className="form-control" 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        {/* Number of Students */}
        <div className="col-md-6">
          <label className="form-label">Number of Students</label>
          <input 
            className="form-control" 
            type="number" 
            name="numberOfStudents" 
            value={formData.numberOfStudents} 
            onChange={handleInputChange} 
            placeholder="Enter number of students" 
            required 
          />
        </div>

        {/* Subjects */}
        <div className="col-12">
          <label className="form-label">Subjects</label>
          {formData.subjects.map((subject, index) => (
            <div key={index} className="d-flex mb-2">
              <input 
                className="form-control" 
                type="text" 
                name="name" 
                value={subject.name} 
                onChange={(event) => handleSubjectChange(index, event)} 
                placeholder="Enter subject name" 
                required 
              />
              <button 
                type="button" 
                className="btn btn-danger ms-2" 
                onClick={() => removeSubject(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={addSubject}
          >
            Add Subject
          </button>
        </div>

        {/* Submit Button */}
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Template;
