import  mongoose, {Schema} from "mongoose";

const departmentBudgetSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true // Middleware
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
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
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Approval',
    required : True
  },
  budgetNote: {
    type: String,
    trim: true,
    maxLength: 300
  },
  updatedBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      immutable: true
  }
},
{timestamps: true}
);

export const DepartmentBudget = mongoose.model('DepartmentBudget',departmentBudgetSchema);