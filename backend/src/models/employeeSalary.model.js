import mongoose, { Schema } from "mongoose";

const employeeSalarySchema = new Schema({
    salaryId: {
        type: String,
        unique: true,
        immutable: true,
        required :true,
        index : true 
    },
    department: {
        type: String,
        ref: 'Department',
        required: true
    },
    role: {
        type: String,
        ref: 'Employee',
        required: true
    },
    employee: {
        type: String,
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
    netSalary: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    createdBy: { //Middleware
        type: String,
        ref: 'Employee',
        required: true,
        immutable: true
    },
    updatedBy: { //Middleware
        type: String,
        ref: 'Employee',
        required: true
    }
}, { timestamps: true });

export const EmployeeSalary = mongoose.model('EmployeeSalary', employeeSalarySchema);