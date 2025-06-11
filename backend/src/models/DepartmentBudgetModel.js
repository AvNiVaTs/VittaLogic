const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const departmentbudgetSchema = new mongoose.Schema({
  created_by: {
    type: String,
    required: true,
    ref: 'Employees'
  },
  department_id: {
    type: String,
    required: true,
    ref: 'Departments'
  },
  dept_budget_id: {
    type: String,
    required: true,
    unique: true
  },
  //period: {}, //changing period into two columns "from_date" to "to_date"
  from_date: {
    type: String,
    required: true
  },
  to_date: {
    type: String,
    required: true
  },
  allocated_amount: {
    type: decimal,
    required: true
  },
  used_amount: {
    type:decimal,
    required:false //should it be auto calculated in the backend?
  },
},
{timestamp: true}
);

export const departmentbudget = mongoose.model('DepartmentBudget',departmentbudgetSchema);