const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
 
    name: { type: String },
    address: { type: String },
    rollno: { type: Number, unique: true },
    temp_name: { type: String },
  });
const Studenttt = mongoose.model('Studenttt', studentSchema);

module.exports = Studenttt;
