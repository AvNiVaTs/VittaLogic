import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const PAYMENT_STATUS = [
  "Pending", 
  "Completed", 
  "Overdue", 
  "Cancelled", 
  "Processing",
  "On Hold"
];

const RECEIVABLES_AGING = [
  "0-30 days", 
  "31-60 days", 
  "61-90 days", 
  "90+ days"
];

const customerPaymentSchema = new Schema({
  customer_payment_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    immutable: true
  },
  customer_id: {
    type: String,
    ref: 'Customer',
    required: true
  },
  
  payment_amount_in_customer_currency: {
    type: decimal,
    required: true,
    min: 0
  },

  payment_amount_in_inr: {
    type: decimal,
    required: true,
    min: 0
  },
  
  purpose: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  
  due_date: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    enum: PAYMENT_STATUS,
    required: true,
    default: "Pending",
    index: true
  },
    
  credit_days: {
    type: Number,
    required: true,
    min: 0,
    max: 365
  },
  
  paid_amount: {
    type: decimal,
    required: true,
    min: 0,
    default: 0
  },
  
  receivables_aging: {
    type: String,
    enum: RECEIVABLES_AGING
  },
  
  currency: {
    type: String,
    ref : 'Customer',
    required: true,
  },
  
  exchange_rate: {
    type: decimal,
    required: true,
    min: 0,
    default: 1.0
  },
  createdBy: { //Middleware
        type: String,
        ref: 'Employee',
        required: true,
        immutable: true
    },
  updatedBy: { //Middleware
      type: String,
      ref: 'Employee',
      required: true
    }
},
{timestamps: true});

// Essential indexes for MongoDB Atlas //query optimizations (optional)
//customerPaymentSchema.index({ customer_id: 1, payment_date: -1 }); 
//customerPaymentSchema.index({ status: 1, due_date: 1 });
//customerPaymentSchema.index({ createdAt: -1 });

// Export model
export const CustomerPayment = mongoose.model("CustomerPayment", customerPaymentSchema);