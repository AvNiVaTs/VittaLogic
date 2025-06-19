import mongoose, {Schema} from "mongoose";
import { formatName } from 'utils/formatName.js';
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

const allowedRoles = [
  "CEO",
  "COO",
  "CFO",
  "CTO",
  "CMO",
  "CHRO",
  "Director",
  "Manager",
  "Team Lead",
  "Staff",
  "Intern",
  "Finance Manager",
  "Accounts Executive",
  "Budget Analyst",
  "Payroll Officer",
  "Auditor",
  "Bookkeeper",
  "Operations Manager",
  "Logistics Coordinator",
  "Procurement Officer",
  "Inventory Manager",
  "Facility Supervisor",
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "QA Tester",
  "DevOps Engineer",
  "IT Support Specialist",
  "System Administrator",
  "Network Engineer",
  "Data Scientist",
  "AI/ML Engineer",
  "Sales Executive",
  "Business Development Manager",
  "Digital Marketing Specialist",
  "SEO Expert",
  "Content Writer",
  "Brand Manager",
  "Marketing Analyst",
  "HR Manager",
  "Recruiter",
  "Training & Development Officer",
  "HR Generalist",
  "Compensation & Benefits Analyst",
  "Vendor Relationship Manager",
  "Customer Support Executive",
  "Client Success Manager",
  "Service Coordinator",
  "Project Manager",
  "Product Manager",
  "Scrum Master",
  "Business Analyst",
  "Legal Advisor",
  "Compliance Officer",
  "Risk Analyst",
  "Contract Manager",
  "UI/UX Designer",
  "Graphic Designer",
  "Visual Content Creator",
  "Product Designer",
  "Admin Officer",
  "Office Assistant",
  "Receptionist",
  "Facility Manager",
  "Security Officer"
];

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
      validator: v => /^[6-9]\d{9}$/.test(v),
      message: 'Invalid Indian contact number'
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  designation: {
    type: String,
    required: true,
    trim : true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  role: {
    type: String,
    enum: allowedRoles,
    required: true
  },
  createdBy: { // Middleware
    type: Schema.Types.ObjectId,
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
