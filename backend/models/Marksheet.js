// backend/models/Marksheet.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String },
    code: { type: Number },
    totalMark: { type: Number, default: 100 },
    passingMark: { type: Number, default: 50 },
    scoredMark: { type: Number,  default:0 },
}, { _id: false });

const marksheetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
    fromDate: { type: Date },
    toDate: { type: Date },
    remarks: { type: String, default: 'Work hard' },
    advisorName: { type: String },
    hodName: { type: String },
    fromAddress: { type: String, default: 'The Principal, Dr SACOE' },
    toAddress: { type: String, default: 'The student ' },
    noOfStudents: { type: Number },
}, { timestamps: true });

const Marksheet = mongoose.model('Marksheet', marksheetSchema);
module.exports = Marksheet;
