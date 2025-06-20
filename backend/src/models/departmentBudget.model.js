import  mongoose, {Schema} from "mongoose";

const departmentbudgetSchema = new Schema({
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
  bdgetId: {
    type: String,
    unique: true,
    immutable: true,
    default: () => 'BUDG-' + Date.now()
  },
  //period: {}, //changing period into two columns "from_date" to "to_date"
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
  budgetNote: {
    type: String,
    trim: true,
    maxlength: 300
  }
  /*used_amount: {
    type:decimal,
    required:false //should it be auto calculated in the backend?
  },*/
},
{timestamps: true}
);

export const DepartmentBudget = mongoose.model('DepartmentBudget',departmentbudgetSchema);