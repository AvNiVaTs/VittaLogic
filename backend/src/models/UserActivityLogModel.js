const mongoose = require('mongoose');

const useractivitylogschema = new mongoose.Schema({
  activity_id: {
    type: String,
    required: true,
    unique: true
  },
  activity_type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  employee_id: {
    type: String,
    required: true,
    ref: 'Employees'
  }
},
  {
  timestamps: true     //Automatically adds `createdAt` and `updatedAt`
  }
);

export const useractivitylog = mongoose.model('UserActivityLog',useractivitylogschema);