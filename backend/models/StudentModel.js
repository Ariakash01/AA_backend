const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    address: { type: String },
    rollno: { type: Number },
    temp_name: { type: String },
  });
const Studenttt = mongoose.model('Studenttt', studentSchema);

module.exports = Studenttt;
