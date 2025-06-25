import mongoose, {Schema} from "mongoose";
import { formatName } from '../utils/formatName.js';
import bcrypt from "bcrypt";

const allowedServices = [
  'Department',
  'Employee',
  'Transaction',
  'Asset',
  'Company Financials',
  'Vendor',
  'Customer',
  'Dashboard',
  'Approval'
];

const allowedDesignation = [
  "C-Level Executive",
  "Department Head / Director",
  "Finance & Accounts",
  "Operations & Administration",
  "Software Development",
  "IT & Infrastructure",
  "Data Science & AI",
  "Sales & Business Development",
  "Marketing & Content",
  "Human Resources (HR)",
  "Customer & Vendor Relations",
  "Product & Project Management",
  "Legal & Compliance",
  "Design & User Experience",
  "Support Staff / Interns"
];

const allowedLevel = [
  1, 2, 3, 4
]

const employeeSchema = new Schema({
  employeeId: {
    type: String,
    unique: true,
    immutable: true,
    default: () => 'EMP-' + Date.now(),
    index : true
  },
  employeeName: {
    type: String,
    required: true,
    trim: true,
    set: formatName,
    validate: {
      validator: function (v) {
        // Allow letters and spaces only
        return /^[A-Za-z ]+$/.test(v);
      },
      message: props => `${props.value} contains invalid characters. Only letters and spaces are allowed.`
    },
    index : true
  },
  emailAddress : {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => /^\S+@\S+\.\S+$/.test(v),
      message: 'Invalid email format'
    }
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^\+?[1-9]\d{7,14}$/.test(v),
      message: 'Invalid contact number format. Use international format like +14155552671'
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  designation: {
    type: String,
    enum : allowedDesignations,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  role: {
    type: String,
    required: true,
    trim : true
  },
  level : {
    type : Number,
    enum : allowedLevel,
    default : 1,
    required : true 
  },
  createdBy: { // Middleware
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  },
  updatedBy: { // Middleware
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  },
  servicePermissions: {
    type: [String],
    validate: {
      validator: (arr) => arr.every(val => allowedServices.includes(val)),
      message: 'One or more service permissions are invalid'
    }
  }
}, {timestamps : true});

export const Employee = mongoose.model('Employee', employeeSchema);
