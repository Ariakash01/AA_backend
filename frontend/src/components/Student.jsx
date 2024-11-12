import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../App.css'
const Student = ({user}) => {
  const { temp_name } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/stu_by_template/${temp_name}/${user._id}`);
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [temp_name, user]);

  const handleUpdate = async (id, updatedData) => {
    try {
      console.log("send");
      await axios.put(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/update-student/${id}`, updatedData);
      console.log("received");
      setStudents((prev) =>
        prev.map((student) => (student._id === id ? { ...student, ...updatedData } : student))
      );
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/delete-student/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleUpdateAll = async (updatedData) => {
    try {
      await axios.put(`https://ariakashs-marksheet-management-backend-5yy1.onrender.com/api/students/update-all-students/${temp_name}`, updatedData);
      setStudents((prev) => prev.map((student) => ({ ...student, ...updatedData })));
    } catch (error) {
      console.error('Error updating all students:', error);
    }
  };
 
  return (

    <>{students&&
    <div>
      <h2>Students List {temp_name}</h2>
     

      <Table striped bordered hover responsive className="mt-4 tt" variant="primary" >
        <thead>
          <tr>
            <th>Roll_Number</th>
            <th>Studen_Name</th>
            <th>Student_Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={student.rollno}
                    onBlur={(e) =>
                      handleUpdate(student._id, { rollno: e.target.value, name: student.name, address: student.address })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={student.name}
                    onBlur={(e) =>
                      handleUpdate(student._id, { rollno: student.rollno, name: e.target.value, address: student.address })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                     as="textarea"
                     rows={4}
                    defaultValue={student.address}
                    onBlur={(e) =>
                      handleUpdate(student._id, { rollno: student.rollno, name: student.name, address: e.target.value })
                    }
                  />
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(student._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
}</>);
};

export default Student;
