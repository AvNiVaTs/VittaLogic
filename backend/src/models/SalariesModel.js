const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const Payment_status = ["Paid", "Pending", "In-Process"] //acceptable enum values for payment status

const salariesSchema = new mongoose.Schema({
  salary_id:{
    type: String,
    required: true,
    unique: true
  },
  pay_month:{
    type: Date, 
    requried: true,
  },
  base_salary:{
    type: decimal,
    required: true,
    min: 0
  },  
  bonus:{
    type: decimal,
    required: false, 
    min: 0
  },
  deductions:{
    type: decimal,
    required: false, 
    min: 0
  },
  net_salary:{
    type: decimal,
    required: true,
    min:0
  },
  payment_status:{
    type: String,
    Enum: Payment_status,
    required: true
  },
  payment_date:{
    type: Date,
    required: true
  },
  employee_id:{
    type: String,
    required: true,
    ref: 'Employees'
  },
  transaction_id:{
    type: String,
    required: true,
    ref: 'Transactions'
  },
});

export const salary = mongoose.model('Salaries',salariesSchema);