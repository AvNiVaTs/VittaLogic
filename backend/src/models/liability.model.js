import mongoose, { Schema, model } from "mongoose";

// Constants
const DECIMAL_TYPE = mongoose.Schema.Types.Decimal128;

const validatePositiveDecimal = function(value) {
  if (!value) return false;
  const numValue = parseFloat(value.toString());
  return numValue > 0;
};

const validateDateRange = function() {
  return this.due_date > this.start_date;
};

const LIABILITY_TYPES = [
  "Bank Loan", 
  "Equipment Loan", 
  "Mortgage", 
  "Credit Card", 
  "Trade Payable", 
  "Accrued Expenses", 
  "Deferred Revenue", 
  "Tax Liability", 
  "Lease Obligation", 
  "Bond Payable", 
  "Notes Payable", 
  "Other"
];

const INTEREST_TYPES = [
  "Simple", 
  "Compound", 
  "None"
];

const PAYMENT_TERMS = [
  "Monthly", 
  "Quarterly", 
  "Yearly", 
  "One-time"
];

const STATUS_OPTIONS = [
  "Active", 
  "Pending", 
  "Completed", 
  "Defaulted", 
  "On Hold",
  "Overdue"
];

const PRIORITY_LEVELS = [
  "Low", 
  "Medium", 
  "High"
];


// Liability Schema
const liabilitySchema = new Schema({
  liability_id: {
    type: String,
    required: [true, 'Liability ID is required'],
    unique: true,
    immutable: true,
    index : true
  },
  liability_name: {
    type: String,
    required: [true, 'Liability name is required'],
    trim: true,
    maxLength: [100, 'Liability name cannot exceed 100 characters'],
    minlength: [2, 'Liability name must be at least 2 characters'],
    index : true
  },
  liability_type: {
    type: String,
    enum: LIABILITY_TYPES,
    required: [true, 'Liability type is required']
  },
  start_date: {
    type: Date,
    required: [true, 'Start date is required']
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: validateDateRange,
      message: 'Due date must be after start date'
    }
  },
  principal_amount: {
    type: DECIMAL_TYPE,
    required: [true, 'Principal amount is required'],
    validate: {
      validator: validatePositiveDecimal,
      message: 'Principal amount must be greater than 0'
    }
  },
  paid_amount: {
    type: DECIMAL_TYPE,
    required: true,
    min: 0,
    default: 0
  },
  interest_type: {
    type: String,
    enum: INTEREST_TYPES,
    required: [true, 'Interest type is required']
  },
  interest_rate: {
    type: DECIMAL_TYPE,
    required: [true, 'Interest rate is required'],
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  payment_terms: {
    type: String,
    enum: {
      values: PAYMENT_TERMS,
      message: 'Invalid payment terms'
    },
    required: [true, 'Payment terms are required']
  },
  current_status: {
    type: String,
    enum: {
      values: STATUS_OPTIONS,
      message: 'Invalid status'
    },
    required: [true, 'Current status is required'],
    default: 'Active'
  },
  priority: {
    type: String,
    enum: {
      values: PRIORITY_LEVELS,
      message: 'Invalid priority level'
    },
    required: [true, 'Priority is required'],
    default: 'Medium'
  },
  liability_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'FinancialAccount',
    required: [true, 'Liability account is required'],
  },
  liability_vendor: {         //how this works?
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Vendor',
    required: [true, 'Liability vendor is required'],
    trim: true,
    maxLength: [100, 'Vendor name cannot exceed 100 characters']
  },
  attachment: {
    type: String,  //cloudinary url
    required: true
  },
  createdBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      immutable: true
  },
  updatedBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      immutable: true
  },
  approval_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Approval',
    required: [true, 'Approval ID field is required']
  },
}, {
  timestamps: true
});

export const Liability = model('Liability', liabilitySchema);