import mongoose, { Schema } from "mongoose";

// Vendor Types
const vendorTypes = [
  "Technology", 
  "Manufacturing", 
  "Software", 
  "Hardware", 
  "Services",
  "Consulting", 
  "Export", 
  "Import", 
  "Retail", 
  "Wholesale",
  "Construction", 
  "Healthcare", 
  "Liability", 
  "Others"
];

// Reference Types
const referenceTypes = [
  "Asset", 
  "Service"
];

// Transaction Types
const assetTransactionTypes = [
  "Raw Material", 
  "Machinery", 
  "Vehicles", 
  "IT Equipments", 
  "Office Supplies", 
  "Others"
];
const serviceTransactionTypes = [
  "Consulting", 
  "Legal", 
  "IT Service", 
  "Training", 
  "Security", 
  "Subscriptions", 
  "Others"
];

// Transaction Modes and Submodes
const transactionModes = [
  "Digital", 
  "Cash", 
  "Cheque"
];
const digitalSubmodes = [
  "NEFT", 
  "RTGS", 
  "IMPS", 
  "UPI", 
  "Bank Transfer",
  "Credit Card", 
  "Debit Card", 
  "Online Wallet", 
  "Net Banking"
];
const cashSubmodes = [
  "Cash Payment", 
  "Cash Deposit", 
  "Cash Withdrawal"
];
const chequeSubmodes = [
  "Cheque Issued", 
  "Cheque Received", 
  "Post-Dated Cheque", 
  "Cancelled Cheque"
];

// Transaction Status
const transactionStatuses = [
  "Pending", 
  "Partially Paid", 
  "Completed", 
  "Cancelled"
];

/* ----------------------------- SCHEMA DEFINITION ----------------------------- */

const purchaseTransactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  enteredBy: {
    type: String,
    ref: "Employee",
    required: true
  },
  departmentWhoPurchased: {
    type: String,
    ref: "Department",
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  vendorType: {
    type: String,
    enum: vendorTypes,
    required: true
  },
  vendorId: {
    type: String,
    ref: "Vendor",
    required: true
  },
  paymentId: {
    type: String,
    ref: "VendorPayment",
    required: true
  },
  approvalId: {
    type: String,
    ref: "Approval",
    required: true
  },
  referenceId: {
    type: String,
    immutable: true
  },
  referenceType: {
    type: String,
    enum: referenceTypes,
    required: true
  },
  assetDetails: {
    assetName: { type: String },
    quantity: { type: Number, min: 1 }
  },
  serviceDetails: {
    serviceName: { type: String },
    serviceDurationMonths: { type: Number, min: 1 }
  },
  purchaseAmount: { 
    type: Number, 
    min: 0,
    required : true
  },
  transactionType: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        if (this.referenceType === "Asset") {
          return assetTransactionTypes.includes(value);
        } else if (this.referenceType === "Service") {
          return serviceTransactionTypes.includes(value);
        }
        return false;
      },
      message: props => `${props.value} is not valid for the selected reference type.`
    }
  },
  transactionMode: {
    type: String,
    enum: transactionModes,
    required: true
  },
  transactionSubmode: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        if (this.transactionMode === "Digital") return digitalSubmodes.includes(value);
        if (this.transactionMode === "Cash") return cashSubmodes.includes(value);
        if (this.transactionMode === "Cheque") return chequeSubmodes.includes(value);
        return false;
      },
      message: props => `${props.value} is not valid for the selected transaction mode.`
    }
  },
  debitAccount: {
    type: String,
    ref: "FinancialAccount"
  },
  creditAccount: {
    type: String,
    ref: "FinancialAccount"
  },
  status: {
    type: String,
    enum: transactionStatuses,
    default: "Pending"
  },
  narration: {
    type: String,
    trim: true
  },
  attachments: {
    type : String // cloudnary url
  }
}, { timestamps: true });

export const PurchaseTransaction = mongoose.models.PurchaseTransaction || mongoose.model("PurchaseTransaction", purchaseTransactionSchema);
