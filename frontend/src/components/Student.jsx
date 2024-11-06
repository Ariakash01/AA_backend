import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Student = () => {
  const { temp_name } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/students/${temp_name}`);
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [temp_name]);

  const handleUpdate = async (id, name, address) => {
    try {
      await axios.put(`/api/students/update-student/${id}`, { name, address });
      setStudents((prev) =>
        prev.map((student) =>
          student._id === id ? { ...student, name, address } : student
        )
      );
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/students/delete-student/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleUpdateAll = async (name, address) => {
    try {
      await axios.put(`/api/students/update-all-students/${temp_name}`, {
        name,
        address,
      });
      setStudents((prev) =>
        prev.map((student) => ({ ...student, name, address }))
      );
    } catch (error) {
      console.error('Error updating all students:', error);
    }
  };

  return (
    <div>
      <h2>Student List for Template: {temp_name}</h2>
      <Button
        variant="secondary"
        onClick={() => handleUpdateAll('Updated Name', 'Updated Address')}
      >
        Update All
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollno}</td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={student.name}
                    onBlur={(e) =>
                      handleUpdate(student._id, e.target.value, student.address)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={student.address}
                    onBlur={(e) =>
                      handleUpdate(student._id, student.name, e.target.value)
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
  );
};

export default Student;
