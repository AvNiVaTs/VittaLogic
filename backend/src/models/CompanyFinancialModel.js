import mongoose, { Schema, model } from "mongoose";

// Constants
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

const BOOLEAN_OPTIONS = ["Yes", "No"];

// Helper function to validate decimal values
const validatePositiveDecimal = function(value) {
  if (!value) return false;
  const numValue = parseFloat(value.toString());
  return numValue > 0;
};

// Helper function to validate date ranges
const validateDateRange = function() {
  return this.due_date > this.start_date;
};

// Company Financial Profile Schema
const financialProfileSchema = new Schema({
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employees',
    required: [true, 'Updated by field is required'],
    index: true
  },
  finance_id: {
    type: String,
    required: [true, 'Finance ID is required'],
    unique: true,
  },
  report_date: {
    type: Date,
    required: [true, 'Report date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Report date cannot be in the future'
    }
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
});

// Financial Accounts Schema
const financialAccountsSchema = new Schema({
  account_id: {
    type: String,
    required: [true, 'Account ID is required'],
    unique: true,
  },
  account_type: {
    type: String,
    enum: {
      values: ACCOUNT_TYPES,
      message: 'Invalid account type'
    },
    required: [true, 'Account type is required']
  },
  account_name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [100, 'Account name cannot exceed 100 characters'],
    minlength: [2, 'Account name must be at least 2 characters']
  },
  parent_account_id: {
    type: String,
    trim: true,
//  validate: {
//    validator: function(value) {
//      if (!value) return true;
//      return /^ACC-\d{6}$/.test(value);
//    },
//    message: 'Parent account ID must follow format ACC-XXXXXX'
//   }
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters']
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
    default: true
  },
  entered_by: {                                        
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employees',
    required: [true, 'Created by field is required']
},
}, {
  timestamps: true,
//  toJSON: { virtuals: true },         //This enables virtual fields (computed or derived values) to be included when the document is converted to JSON
//  toObject: { virtuals: true }        //same thing for object
});

//==================================== Indexes for financial accounts ========================================
//financialAccountsSchema.index({ account_id: 1 });
//financialAccountsSchema.index({ account_type: 1, is_active: 1 });
//financialAccountsSchema.index({ parent_account_id: 1 });



// Export models
export const FinancialProfile = model('FinancialProfile', financialProfileSchema);
export const FinancialAccount = model('FinancialAccount', financialAccountsSchema);