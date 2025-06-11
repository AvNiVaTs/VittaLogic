const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_id: {
    type: String,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

export const department = mongoose.model('Departments',departmentSchema);