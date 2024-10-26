// backend/controllers/marksheetController.js
const Marksheet = require('../models/Marksheet');

// Create a new marksheet template
exports.createMarksheet = async (req, res) => {
    const userId = req.user._id;
    const data = req.body;

    const marksheet = new Marksheet({
        ...data,
        userId,
    });

    try {
        const createdMarksheet = await marksheet.save();
        res.status(201).json(createdMarksheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all marksheet templates for the logged-in user
exports.getMarksheets = async (req, res) => {
    const userId = req.user._id;
    try {
        const marksheets = await Marksheet.find({ userId });
        res.json(marksheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single marksheet by ID
exports.getMarksheetById = async (req, res) => {
    const { id } = req.params;
    try {
        const marksheet = await Marksheet.findOne({ _id: id, userId: req.user._id });
        if (marksheet) {
            res.json(marksheet);
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a marksheet template
exports.deleteMarksheet = async (req, res) => {
    const { id } = req.params;
    try {
        const marksheet = await Marksheet.findOneAndDelete({ _id: id, userId: req.user._id });
        if (marksheet) {
            res.json({ message: 'Marksheet deleted successfully' });
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a marksheet template
exports.updateMarksheet = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const marksheet = await Marksheet.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            data,
            { new: true }
        );
        if (marksheet) {
            res.json(marksheet);
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllMarksheets = async (req, res) => {
    try {
        const marksheets = await Marksheet.find(); // Assuming you're using MongoDB
        res.status(200).json(marksheets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch marksheets', error });
    }
};




exports.getMarksheetss = async (req, res) => {
    try {
        const marksheets = await Marksheet.find(); // Fetch all marksheets from the DB
        res.json(marksheets); // Send back to the frontend
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch marksheets' });
    }
};

// Update a specific marksheet
exports.updateMarksheetss = async (req, res) => {
    const { templateId } = req.params;
    const { students } = req.body; // Updated students data from frontend

    try {
        const marksheet = await Marksheet.findById(templateId); // Find the marksheet by ID
        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        // Update student marks, attendance, and other fields
        marksheet.students.forEach(student => {
            const updatedStudent = students.find(s => s._id === student._id);
            if (updatedStudent) {
                student.marks = updatedStudent.marks;
                student.attendanceRate = updatedStudent.attendanceRate;
                student.toAddress = updatedStudent.toAddress;
                student.remark = updatedStudent.remark;
            }
        });

        await marksheet.save(); // Save updated marksheet
        res.json({ message: 'Marks updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update marks' });
    }
};









exports.updateStudentMarkss = async (req, res) => {
    const { templateId } = req.params;  // ID of the marksheet template
    const { name, rollno, subjects,attendanceRate, toAddress, remarks } = req.body;  // Data from the request body
  
    try {
        // Find the marksheet by the template ID
        const marksheet = await Marksheet.findById(templateId);
        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }
  
        // Update student's name and roll number if they are present in the request
        if (name) {
            marksheet.stu_name = name;
        }
        if (rollno) {
            marksheet.rollno = rollno;
        }
  
        
  
        // Update the attendance rate, address, and remarks if they are present in the request
        if (attendanceRate) {
            marksheet.attendanceRate = attendanceRate;
        }
        if (toAddress) {
            marksheet.toAddress = toAddress;
        }
        if (remarks) {
            marksheet.remarks = remarks;
        }
        
        // Save the updated marksheet
        await marksheet.save();
        res.json({ message: 'Student marks updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update student marks' });
    }
};




exports.updateStudentMarkss =  async (req, res) => {
    const { templateId } = req.params; // ID of the marksheet template
    const { name, rollno, subjects, attendanceRate, toAddress, remarks } = req.body; // Data from the request body

    try {
        // Find the marksheet by the template ID
        const marksheet = await Marksheet.findById(templateId);
        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        // Update student's name and roll number if they are present in the request
        if (name !== undefined) {
            marksheet.stu_name = name;
        }
        if (rollno !== undefined) {
            marksheet.rollno = rollno;
        }

        // Update the attendance rate, address, and remarks if they are present in the request
        if (attendanceRate !== undefined) {
            marksheet.attendanceRate = attendanceRate;
        }
        if (toAddress !== undefined) {
            marksheet.toAddress = toAddress;
        }
        if (remarks !== undefined) {
            marksheet.remarks = remarks;
        }

        // Update the subjects
        if (Array.isArray(subjects)) {
            subjects.forEach(({ code, scoredMark }) => {
                const existingSubject = marksheet.subjects.find(sub => sub.code === code);
                if (existingSubject) {
                    // Update existing subject's scoredMark if it is provided
                    if (scoredMark !== undefined) {
                        existingSubject.scoredMark = scoredMark;
                    }
                }
            });
        }

        // Save the updated marksheet
        await marksheet.save();
        res.json({ message: 'Student marks updated successfully', marksheet });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Failed to update student marks', error: err.message });
    }
};

exports.updateStudentMarks =  async (req, res) => {
    const { templateId } = req.params;
    const { name, rollno, attendanceRate, toAddress, remark, subjects } = req.body;

    try {
        // Find the marksheet by ID
        const marksheet = await Marksheet.findById(templateId);
        if (!marksheet) return res.status(404).json({ message: 'Marksheet not found' });

        // Update general fields
        if (name) marksheet.stu_name = name;
        if (rollno) marksheet.rollno = rollno;
        if (attendanceRate) marksheet.attendanceRate = attendanceRate;
        if (toAddress) marksheet.toAddress = toAddress;
        if (remark) marksheet.remarks = remark;

        // Update or add subjects in the subjects array
        if (subjects && Array.isArray(subjects)) {
            subjects.forEach((subjectUpdate) => {
            
                const existingSubject = marksheet.subjects.find(sub => sub.code == subjectUpdate.code);

                if (existingSubject) {
                    // Update existing subject score
                    existingSubject.scoredMark = subjectUpdate.scoredMark;
                } else {
                    // Add new subject if it doesn’t exist)
                    marksheet.subjects.push(subjectUpdate);
                }
            });
        }

        // Save updated marksheet
        await marksheet.save();
        res.status(200).json({ message: 'Marksheet updated successfully', marksheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update marksheet' });
    }
};



    


  



  exports.updateMarks = async (req, res) => {
  const { templateId } = req.params;
  const { students } = req.body;

  try {
    const marksheet = await Marksheet.findById(templateId);
    if (!marksheet) {
      return res.status(404).json({ message: 'Marksheet not found' });
    }

    // Loop through the students and update their records
    for (const studentId in students) {
      const student = marksheet.students.id(studentId);
      if (student) {
        const { marks, attendanceRate, toAddress, remark } = students[studentId];
        if (marks) {
          student.marks = { ...student.marks, ...marks };
        }
        if (attendanceRate) {
          student.attendanceRate = attendanceRate;
        }
        if (toAddress) {
          student.toAddress = toAddress;
        }
        if (remark) {
          student.remark = remark;
        }
      }
    }

    await marksheet.save();
    res.json({ message: 'All student marks updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update marks' });
  }
};