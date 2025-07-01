import mongoose, { Schema, model } from "mongoose";

const DECIMAL_TYPE = mongoose.Schema.Types.Decimal128;

const ACCOUNT_TYPES = [
  "Asset", 
  "Liability", 
  "Equity",
  "Income", 
  "Expense", 
  "Asset(Contra)", 
  "Income(Contra)", 
  "Control Account(Payables)", 
  "Control Account(Receivables)", 
  "Other Income", 
  "Other Expense", 
  "Suspense Account", 
  "Memo Account", 
  "Statistical Account", 
  "Budget Account"
];

const ACCOUNT_CATEGORY = ["Credit Account", "Debit Account"];

const BOOLEAN_OPTIONS = ["Yes", "No"];

const validatePositiveDecimal = function(value) {
  if (!value) return false;
  const numValue = parseFloat(value.toString());
  return numValue > 0;
};

const validateDateRange = function() {
  return this.due_date > this.start_date;
};//No need of this

const financialProfileSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employees',
    required : true,
    index: true,
    immutable: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employees',
    required : true,
    index: true,
    immutable: true
  },
  finance_id: {
    type: String,
    required: [true, 'Finance ID is required'],
    unique: true,
    immutable: true,
    index : true
  },
  reserve_capital_cash: {
    type: DECIMAL_TYPE,
    required: [true, 'Reserve capital cash is required'],
    validate: {
      validator: validatePositiveDecimal,
      message: 'Reserve capital cash must be greater than 0'
    }
  },
  reserve_capital_bank: {
    type: DECIMAL_TYPE,
    required: [true, 'Reserve capital bank is required'],
    validate: {
      validator: validatePositiveDecimal,
      message: 'Reserve capital bank must be greater than 0'
    }
  }
} , {timestamps : true});

const financialAccountSchema = new Schema({
  account_id: {
    type: String,
    required: [true, 'Account ID is required'],
    unique: true,
    immutable: true,
    index : true
  },
  account_type: {
    type: String,
    enum: {
      values: ACCOUNT_TYPES,
      message: 'Invalid account type'
    },
    required: [true, 'Account type is required']
  },
  account_category: {
    type: String,
    enum: ACCOUNT_CATEGORY,
    required: true
  },
  account_name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxLength: [100, 'Account name cannot exceed 100 characters'],
    minlength: [2, 'Account name must be at least 2 characters'],
    index : true
  },
  parent_account_id: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxLength: [300, 'Description cannot exceed 300 characters']
  },
  opening_balance: {
    type: DECIMAL_TYPE,
    required: [true, 'Opening balance is required'],
    default: 0
  },
  current_balance: {
    type: DECIMAL_TYPE,
    default: 0
  },
  is_active: {
    type: Boolean,
    enum : BOOLEAN_OPTIONS,
    default: true
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
      immutable: true,
      required: true,
  }
}, {
  timestamps: true
});

export const FinancialProfile = model('FinancialProfile', financialProfileSchema);

export const FinancialAccount = model('FinancialAccount', financialAccountSchema);