import  mongoose, {Schema} from "mongoose";

const departmentBudgetSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'Employee',
    required: true,
    immutable: true // Middleware
  },
  departmentId: {
    type: String,
    ref: 'Department',
    required: true
  },
  budgetId: {
    type: String,
    unique: true,
    immutable: true,
    required : true,
    index : true
  },
  
  timePeriodFrom: {
    type: Date,
    required: true
  },
  timePeriodTo: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.timePeriodFrom;
      },
      message: 'Time Period To must be later than Time Period From'
    }
  },
  allocatedAmount: {
    type: Number,
    required: true,
    min: [0, 'Allocated amount must be a positive number']
  },
  approvalId : {
    type : String,
    ref : 'Approval',
    required : true
  },
  budgetNote: {
    type: String,
    trim: true,
    maxLength: 300
  },
  updatedBy: { //Middleware
      type: String,
      ref: 'Employee',
      immutable: true
  }
},
{timestamps: true}
);

export const DepartmentBudget = mongoose.model('DepartmentBudget',departmentBudgetSchema);