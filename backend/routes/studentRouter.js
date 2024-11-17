const express = require('express');
const Studenttt = require('../models/StudentModel');
const router = express.Router();



router.post('/create-students/:user', async (req, res) => {
  const { user } = req.params;

  try {
    const { temp_name, start_roll_no, num_students, students } = req.body;

    if (students) {
      // Handle bulk entry from Excel
      const newStudents = students.map((student) => ({
        userId: user,
        rollno: student.RollNumber,
        temp_name,
        name: student.StudentName,
        address: student.Address || '', // Default address if missing
      }));
      const response = await Studenttt.insertMany(newStudents);
      res.json(response);
    } else {
      // Handle manual entry
      const newStudents = [];
      for (let i = 0; i < num_students; i++) {
        const rollno = parseInt(start_roll_no) + i;
        const student = new Studenttt({
          userId: user,
          rollno,
          temp_name,
          // Placeholder for manual entry if needed
        });
        newStudents.push(student);
      }
      const response = await Studenttt.insertMany(newStudents);
      res.json(response);
    }
  } catch (error) {
    console.error('Error creating students:', error);
    res.status(500).json({ message: 'Error creating students', error: error.message });
  }
});





/*

router.post('/create-students/:user', async (req, res) => {
  const {user} =req.params;
    try {
      const { temp_name, start_roll_no, num_students } = req.body;
 
    
      for (let i = 0; i < num_students; i++) {

        const rollno = parseInt(start_roll_no) + parseInt(i);
        // Bulk insert only new students into DB
     const ress=  await Studenttt.create({
          userId:user,
          // Placeholder address
          rollno,
          temp_name
    });
  
 
  }
  res.json(ress);
      }  catch (error) {
      console.error('Error creating students:', error);
      res.status(500).json({ message: 'Error creating students', error: error.message });
    }
  });
  

*/


router.get('/stu/:userId',async(req,res)=>{
  
    const {userId}= req.params;
    try {
        const marksheets = await Studenttt.find({ userId });
        res.json(marksheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


router.get('/stu_by_template/:temp_name/:user', async (req, res) => {
    try {
      const { temp_name,user} = req.params;
      console.log(user);
      const students = await Studenttt.find({userId:user , temp_name:temp_name});
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  });



  

  router.put('/update-student/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { rollno, name, address } = req.body;
  
      const updatedStudent = await Studenttt.findByIdAndUpdate(
        id,
        { rollno, name, address },
        { new: true }
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Failed to update student' });
    }
  });

  
  router.delete('/delete-student/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedStudent = await Studenttt.findByIdAndDelete(id);
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Failed to delete student' });
    }
  });

  router.delete('/studs/:user', async (req, res) =>{
    console.log("hello")
    
        const { templateName } = req.query;
        const {user} =req.params
       
        if (!templateName) {
            return res.status(400).json({ message: 'Template name is required' });
        }
    
        try {
            const result = await Studenttt.deleteMany({temp_name:templateName,userId:user} );
            if (result.deletedCount > 0) {
                return res.status(200).json({ message: 'Marksheets deleted successfully' });
            } else {
                return res.status(404).json({ message: 'Template not found' });
            }
        } catch (error) {
            console.error('Error deleting marksheets:', error);
            return res.status(500).json({ message: 'Failed to delete marksheets', error: error.message });
        }
    });
    





  router.put('/update-all-students/:temp_name', async (req, res) => {
    try {
      const { temp_name } = req.params;
      const { rollno, name, address } = req.body;
  
      await Studenttt.updateMany(
        { temp_name },
        { rollno, name, address }
      );
  
      res.json({ message: 'All students updated successfully' });
    } catch (error) {
      console.error('Error updating all students:', error);
      res.status(500).json({ message: 'Failed to update all students' });
    }
  });
  
module.exports = router;
