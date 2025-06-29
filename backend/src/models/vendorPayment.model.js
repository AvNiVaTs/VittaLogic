import mongoose, {Schema} from "mongoose";

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
    trim: true,
    immutable: true
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  currency : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Vendor',
    required : true 
  },
  payment_amount_in_vendor_currency: {
    type: decimal,
    required: true,
    min: 0.01
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
    min: 0.01
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
    default: "Pending"  ///should there be a default?
  },
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
  }
} , {timestamps : true});

export const VendorPayment = mongoose.model('VendorPayment', vendorPaymentSchema);