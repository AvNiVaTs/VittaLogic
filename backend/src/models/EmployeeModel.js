const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password:{
    type: String,
    requried: true
  },
  designation: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
    required: true
  },
  department_id: {
    type: String,
    required: true,
    ref: 'Departments' // For logical reference (used manually, not via populate unless _id is used)
  }
});

export const employee = mongoose.model('Employees', employeeSchema);
