// backend/models/Marksheet.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
    totalMark: { type: Number, default: 100 },
    passingMark: { type: Number, default: 50 },
    scoredMark: { type: Number,  default:0 },
}, );

const marksheetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rollno: { type: Number ,default:11214004},
    stu_name:{type:String,default:'stud'},
    templateName: { type: String },
    college: { type: String, default: 'Dr sacoe' },
    department: { type: String, default: 'IT' },
    testName: { type: String, default: 'Periodical Test 1' },
    year: { type: String },
    oddEven: { type: String }, // 'Odd' or 'Even'
    sem: { type: String },
    date: { type: Date, default: Date.now },
    classSem: { type: String},
    subjects: [subjectSchema],
    attendanceRate: { type: Number },
    fromDate: { type: Date , default: Date.now},
    toDate: { type: Date , default: Date.now},
    remarks: { type: String, default: 'Work Hard. Study well and can do better' },
    advisorName: { type: String },
    hodName: { type: String },
    fromAddress: { type: String, default: 'The Principal Dr. Sivanthi Aditanar College of Engineering, Tirunelveli Road, Tiruchendur -628 215' },
    toAddress: { type: String, default: 'Empty' },
    noOfStudents: { type: Number },
    sum_total_mark:{ type: Number,  default:0 },
    sum_scored_mark:{ type: Number ,  default:0},
    status:{type:String,default:'Pass'},
    rank:{type:Number,default:0}
}, { timestamps: true });

const Marksheet = mongoose.model('Marksheet', marksheetSchema);
module.exports = Marksheet;
