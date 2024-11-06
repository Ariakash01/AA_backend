const express = require('express');
const Studenttt = require('../models/StudentModel');
const router = express.Router();
router.post('/create-students', async (req, res) => {
    try {
      const { temp_name, start_roll_no, num_students } = req.body;
   
      const students = [];
      for (let i = 0; i < num_students; i++) {
        const rollno = start_roll_no + i;
  
        // Check if a student with this roll number already exists
        const existingStudent = await Studenttt.findOne({ rollno });
        if (existingStudent) {
          console.log(`Roll number ${rollno} already exists. Skipping.`);
          continue; // Skip this roll number if it already exists
        }
  
        // Create a new student entry if roll number is unique
        const newStudent = new Studenttt({
          name: `Student ${rollno}`, // Placeholder name
          address: `Address ${rollno}`, // Placeholder address
          rollno,
          temp_name
        });
  
        students.push(newStudent);
      }
  
      if (students.length > 0) {
        // Bulk insert only new students into DB
        await Studenttt.insertMany(students);
        res.status(200).json({ message: 'Students created successfully' });
      } else {
        res.status(200).json({ message: 'No new students to create; all roll numbers already exist.' });
      }
    } catch (error) {
      console.error('Error creating students:', error);
      res.status(500).json({ message: 'Error creating students', error: error.message });
    }
  });
  



router.get('/students/:temp_name', async (req, res) => {
    try {
      const { temp_name } = req.params;
      const students = await Student.find({ temp_name });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  });

  

  router.put('/update-student/:id', async (req, res) => {
    try {
      const { name, address } = req.body;
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { name, address },
        { new: true }
      );
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error updating student', error: error.message });
    }
  });

  
  router.delete('/delete-student/:id', async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
  });

  
  router.put('/update-all-students/:temp_name', async (req, res) => {
    try {
      const { name, address } = req.body;
      const updatedStudents = await Student.updateMany(
        { temp_name: req.params.temp_name },
        { name, address }
      );
      res.status(200).json(updatedStudents);
    } catch (error) {
      res.status(500).json({ message: 'Error updating all students', error: error.message });
    }
  });
  
module.exports = router;
