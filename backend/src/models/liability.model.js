import mongoose, { Schema, model } from "mongoose";

// Constants
const DECIMAL_TYPE = mongoose.Schema.Types.Decimal128;

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
  "Fixed", 
  "Variable", 
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
  "On Hold"
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
    immutable: true
  },
  liability_name: {
    type: String,
    required: [true, 'Liability name is required'],
    trim: true,
    maxlength: [100, 'Liability name cannot exceed 100 characters'],
    minlength: [2, 'Liability name must be at least 2 characters']
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
  outstanding_amount: {
    type: DECIMAL_TYPE,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return validatePositiveDecimal(value);
      },
      message: 'Outstanding amount must be greater than 0'
    }
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
//  variable_rate_benchmark: {  //no idea wtf this does //also we need to add extra fields for variable interest rate
//    type: String,
//    validate: {
//      validator: function(value) {
//        return this.interest_type !== 'Variable' || (value && value.length > 0);
//      },
//      message: 'Variable rate benchmark is required for variable interest rates'
//    }
//  },
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
  associated_entities: {
    type: [String],
    validate: {
      validator: function(entities) {
        return entities && entities.length > 0;
      },
      message: 'At least one associated entity is required'
    }
  },
  liability_account: {
    type: String,
    required: [true, 'Liability account is required'],
  },
  liability_vendor: {         //how this works?
    type: String,
    required: [true, 'Liability vendor is required'],
    trim: true,
    maxlength: [100, 'Vendor name cannot exceed 100 characters']
  },
  attachment: {
    type: String,  //cloudinary url
    required: true
  },
/*  attachments: [{ //how to handle attachments??  //cloudinary
    filename: {
      type: String,
      required: true
    },
//    file_path: {
//      type: String,   
//      required: true
//    },
    file_type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      required: true
    },
    file_size: {
      type: Number,
      max: [10485760, 'File size cannot exceed 10MB'] // 10MB in bytes
    },
    uploaded_date: {
      type: Date,
      default: Date.now
    } 
  }], */
/*  payment_history: [{
    payment_date: {
      type: Date,
      required: true
    },
    amount_paid: {
      type: DECIMAL_TYPE,
      required: true,
      validate: {
        validator: validatePositiveDecimal,
        message: 'Payment amount must be greater than 0'
      }
    },
    payment_method: {
      type: String,
      enum: ['Bank Transfer', 'Check', 'Cash', 'Credit Card', 'Online', 'Other']
    },
    reference_number: String,
    notes: String
  }], */
  createdBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      immutable: true
  },
  updatedBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      immutable: true
  },
  approval_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Approval',
    required: [true, 'Approval ID field is required']
  },
}, {
  timestamps: true,
//  toJSON: { virtuals: true },
//  toObject: { virtuals: true }
});

/*//===================== Virtual fields for liability calculations ================
//liabilitySchema.virtual('total_paid').get(function() {
//  if (!this.payment_history || this.payment_history.length === 0) return 0;
//  return this.payment_history.reduce((total, payment) => {
//   return total + parseFloat(payment.amount_paid.toString());
//  }, 0);
//});

//liabilitySchema.virtual('remaining_balance').get(function() {
//  const principal = parseFloat(this.principal_amount.toString());
//  const paid = this.total_paid;
//  return Math.max(0, principal - paid);
//});

//liabilitySchema.virtual('days_until_due').get(function() {
//  if (!this.due_date) return null;
//  const today = new Date();
//  const dueDate = new Date(this.due_date);
//  const timeDiff = dueDate.getTime() - today.getTime();
//  return Math.ceil(timeDiff / (1000 * 3600 * 24));
//});

//liabilitySchema.virtual('is_overdue').get(function() {
//  const daysUntilDue = this.days_until_due;
//  return daysUntilDue !== null && daysUntilDue < 0;
//});

// Pre-save middleware
liabilitySchema.pre('save', function(next) {
  // Set outstanding amount to principal if not provided
  if (!this.outstanding_amount) {
    this.outstanding_amount = this.principal_amount;
  }
  
  // Calculate next payment date based on payment terms
  if (this.start_date && this.payment_terms && !this.next_payment_date) {
    const startDate = new Date(this.start_date);
    switch (this.payment_terms) {
      case 'Monthly':
        this.next_payment_date = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      case 'Quarterly':
        this.next_payment_date = new Date(startDate.setMonth(startDate.getMonth() + 3));
        break;
      case 'Yearly':
        this.next_payment_date = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        break;
      default:
        this.next_payment_date = this.due_date;
    }
  }
  
  next();
});

// Indexes for better query performance
liabilitySchema.index({ liability_id: 1 });
liabilitySchema.index({ current_status: 1, priority: 1 });
liabilitySchema.index({ due_date: 1, current_status: 1 });
liabilitySchema.index({ liability_type: 1, current_status: 1 });
liabilitySchema.index({ created_by: 1, createdAt: -1 });
liabilitySchema.index({ reminder_needed: 1, due_date: 1 });

// Static methods
liabilitySchema.statics.findOverdue = function() {
  return this.find({
    due_date: { $lt: new Date() },
    current_status: { $in: ['Active', 'Pending'] }
  });
};

liabilitySchema.statics.findDueSoon = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    due_date: { $lte: futureDate, $gte: new Date() },
    current_status: { $in: ['Active', 'Pending'] }
  });
}; */

export const Liability = model('Liability', liabilitySchema);