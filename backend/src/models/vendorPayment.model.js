import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const PAYMENT_METHODS = [
  "Bank Transfer", 
  "Wire Transfer", 
  "Cheque", 
  "Cash", 
  "Online Payment", 
  "UPI", 
  "NEFT", 
  "RTGS"
];

const PAYMENT_STATUSES = [
  "Processing", 
  "Pending", 
  "Completed", 
  "Failed",
  "Cancelled", 
  "On Hold"
];

const vendorPaymentSchema = new Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    index : true
  },
  vendor_id: {
    type: String,
    ref: 'Vendor',
    required: true,
  },
  currency : {
    type : String,
    ref : 'Vendor',
    required : true 
  },
  payment_amount_in_vendor_currency: {
    type: decimal,
    required: true,
    min: 0
  },
  exchangeRate: { 
    type: decimal,
    required: true,
    min: 0.001,
    default: 1
  },
  payment_amount_in_indian_currency: {
    type: decimal,
    required: true,
    min: 0
  },
  paid_amount: {
    type: decimal,
    required: true,
    min: 0,
    default: 0
  },
  due_date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid due date' // will this work?
    }
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  payment_method: {
    type: String,
    enum: PAYMENT_METHODS,
    required: true
  },
  status: {
    type: String,
    enum: PAYMENT_STATUSES,
    required: true,
    default: "Pending" , ///should there be a default?
    index : true
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
} , {timestamps : true});

export const VendorPayment = mongoose.model('VendorPayment', vendorPaymentSchema);