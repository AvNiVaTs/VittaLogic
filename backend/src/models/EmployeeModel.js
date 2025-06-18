import mongoose, {Schema} from "mongoose";

const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    index : true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
    set: function (v) {
      // Normalize whitespace and capitalize first letter of each word
      return v
        .trim()
        .replace(/\s+/g, ' ') // remove extra internal spaces
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
    },
    validate: {
      validator: function (v) {
        // Allow letters and spaces only
        return /^[A-Za-z ]+$/.test(v);
      },
      message: props => `${props.value} contains invalid characters. Only letters and spaces are allowed.`
    },
    index : true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    unique : true
  },
  password:{
    type: String,
    requried: [true , "Password is required"]
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
    type: Schema.Types.ObjectId,
    ref: 'Department' // For logical reference (used manually, not via populate unless _id is used)
  }
} , {timestamps : true});

export const employee = mongoose.model('Employee', employeeSchema);
