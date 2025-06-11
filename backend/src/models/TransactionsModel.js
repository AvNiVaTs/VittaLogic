const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const transaction_modes = []

const transactionsSchema = new mongoose.Schema({
    transaction_id: {
    type: String,
    required: true,
    unique: true
  },
  entered_by: {
    type: String,
    required: true, // shouldn't it be automatically filled?? //fixed field
    ref: 'Employees'
  }, 
  approved_by: {
    type: String,
    required: true,
    ref: 'Employees'
  },
  date: {
    type: Date,
    required: true
  },
  transaction_type: {
    type: String,
    required: true
  },
  transaction_subtype: {
    type: String,
    required: true
  },
  transaction_mode_category: {
    type: String,
    required: true
  },
  transaction_mode: {
    type: String,       //shouldn't it be enum type???? 
    required: true
  },
  amount: {
    type: decimal,
    required: true,
    min: 0
  },
  debit_account_id: {
    type: String,
    required: true,
    ref: 'Accounts'
  },
  credit_account_id: {
    type: String,
    required: true,
    ref: 'Accounts'
  },
  narration: {
    type: String,
    required: false
  },
  status: {
    type: String,  //shouldnt it be enum?
    required: true
  },
  department_id: {
    type: String,
    required: true,
    ref: 'Departments'
  }
},
{
  timestamps: true
});

export const transaction = mongoose.model('Transactions',transactionsSchema);