import mongoose, { Schema } from "mongoose";

const allowedRoles = [
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


const employeeSalarySchema = new Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    role: {
        type: String,
        enum: allowedRoles,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    payMonth: {
        type: String, // e.g. "06-2025" or "2025-06"
        required: true,
        match: [/^\d{2}-\d{4}$/, 'Invalid format. Use MM-YYYY']
    },
    baseSalary: {
        type: Number,
        required: true,
        min: 0
    },
    bonus: {
        type: Number,
        default: 0,
        min: 0
    },
    deduction: {
        type: Number,
        default: 0,
        min: 0
    },
    netSalary: { //Middleware
        type: Number,
        required: true 
    },
    paymentDate: {
        type: Date,
        required: true
    },
    createdBy: { //Middleware
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        immutable: true
    }
}, { timestamps: true });

export const EmployeeSalary = mongoose.model('EmployeeSalary', employeeSalarySchema);