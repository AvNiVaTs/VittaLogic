const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const companyfinancialSchema = new mongoose.Schema({
  updated_by: {
    type: String,
    required: true,
    ref: 'Employees'
  },
  finance_id: {
    type: String,
    required: true,
    unique: true
  },
  report_date: {
    type: Date,
    required: true
  },
  reserve_capital_cash: {
    type: decimal,
    required: true
  },
  reserve_capital_bank: {
    type: decimal,
    required: true
  },
  liabilities: {
    type: decimal,
    required: true
  },
  note: {
    type: String,
    required: false
  }
});

export const companyfinancial = model.mongoose('CompanyFinancials',companyfinancialSchema);