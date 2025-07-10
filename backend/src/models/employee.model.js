import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { formatName } from '../utils/formatName.js';

const allowedServices = [
  'Department Service',
  'Employee Service',
  'Transaction Service',
  'Asset Service',
  'Company Financials Service',
  'Vendor Service',
  'Customer Service',
  'Dashboard Service',
  'Approval Service'
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
  "Support Staff / Interns",
  "Others"
];

const allowedLevel = [
  1, 2, 3, 4
]

const employeeSchema = new Schema({
  employeeId: {
    type: String,
    unique: true,
    required: true,
    immutable: true,
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
    enum : allowedDesignation,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true,
    immutable : true
  },
  department: {
    type: String,
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
    required : true ,
    index : true
  },
  createdBy: { // Middleware
    type: String,
    ref: 'Employee',
    immutable: true
  },
  updatedBy: { // Middleware
    type: String,
    ref: 'Employee',
  },
  servicePermissions: {
    type: [String],
    validate: {
      validator: (arr) => arr.every(val => allowedServices.includes(val)),
      message: 'One or more service permissions are invalid'
    }
  },
  refreshToken: {
    type: String
  }
}, {timestamps : true});

// ====== Password Encryption ======
employeeSchema.pre("save", async function (next) {
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// ====== Check Password ======
employeeSchema.methods.isPasswordCorrect = async function(enteredPassword) {
  if (!enteredPassword || !this?.password) {
    throw new Error("Missing data or hash for password comparison");
  }

  return await bcrypt.compare(enteredPassword, this.password);
}

employeeSchema.methods.generateAccessTokenforEmp = function(){
  return jwt.sign({
      employeeId: this.employeeId,
      designation: this.designation,
      role: this.role
  },
  process.env.EMP_ACCESS_TOKEN_SECRET,
  {
      expiresIn: process.env.EMP_ACCESS_TOKEN_EXPIRY
  }
)
}

employeeSchema.methods.generateRefreshTokenforEmp = function(){
  return jwt.sign({
    employeeId: this.employeeId
  },
  process.env.EMP_REFRESH_TOKEN_SECRET,
  {
      expiresIn: process.env.EMP_REFRESH_TOKEN_EXPIRY
  }
)
}

export const Employee = mongoose.model('Employee', employeeSchema);