import mongoose from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const PAYMENT_STATUS = [
  "Pending", 
  "Completed", 
  "Overdue", 
  "Cancelled", 
  "Processing"
];

const RECEIVABLES_AGING = [
  "0-30 days", 
  "31-60 days", 
  "61-90 days", 
  "90+ days"
];

const CURRENCIES = [
  "USD", 
  "EUR", 
  "GBP", 
  "JPY", 
  "AUD", 
  "CAD", 
  "CHF", 
  "CNY", 
  "INR"
];

const customerPaymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
    immutable: true
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true,
    immutable: true
  },
  
  payment_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  
  payment_amount: {
    type: decimal,
    required: true,
    min: 0
  },
  
  purpose: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
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
  
  credit_limit: {
    type: decimal,
    required: true,
    min: 0
  },
  
  credit_days: {
    type: Number,
    required: true,
    min: 0,
    max: 365
  },
  
  outstanding_amount: {
    type: decimal,
    required: true,
    min: 0
  },
  
  receivables_aging: {
    type: String,
    enum: RECEIVABLES_AGING
  },
  
  currency: {
    type: String,
    enum: CURRENCIES,
    required: true,
    default: "INR"
  },
  
  exchange_rate: {
    type: decimal,
    required: true,
    min: 0,
    default: 1.0
  }
}, {
  timestamps: true,
  collection: "customer_payments"
});

// Essential indexes for MongoDB Atlas //query optimizations (optional)
//customerPaymentSchema.index({ customer_id: 1, payment_date: -1 }); 
//customerPaymentSchema.index({ status: 1, due_date: 1 });
//customerPaymentSchema.index({ createdAt: -1 });

// Export model
module.exports = mongoose.model("CustomerPayments", customerPaymentSchema);