import mongoose, { Schema } from "mongoose";

const referenceTypes = [
  "Salary", 
  "Liability", 
  "Refund/Investment", 
  "Maintenance",
  "Repair"
];

const liabilityTypes = [
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

const assetTypes = [
  "IT Equipment", 
  "Office Furniture", 
  "Machinery", 
  "Vehicles", 
  "Real Estate",
  "Electrical Appliances", 
  "Software Licenses", 
  "Miscellaneous"
];

const transactionTypes = [
    "Income", 
    "Expense", 
    "Transfer", 
    "Investment"
];

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

const transactionStatuses = [
    "Pending", 
    "Partially Paid", 
    "Completed", 
    "Cancelled"
];

/* ----------------------------- SCHEMA DEFINITION ----------------------------- */

const internalTransactionSchema = new Schema({
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
  transactionDate: {
    type: Date,
    required: true
  },
  approvalId: {
    type: String,
    ref: "Approval",
    required: true
  },
  reference_type: {
    type: String,
    enum: referenceTypes,
    required: true
  },
  salaryDetails: {
    department: {
      type: String,
      ref: "Department",
      required: function () {
        return this.reference_type === "Salary";
      }
    },
    employeeId: {
      type: String,
      ref: "Employee",
      required: function () {
        return this.reference_type === "Salary";
      }
    },
    referenceId: {
      type: String,
      ref: "EmployeeSalary",
      required: function () {
        return this.reference_type === "Salary";
      }
    }
  },
  liabilityDetails: {
    liabilityType: {
      type: String,
      enum: liabilityTypes,
      required: function () {
        return this.reference_type === "Liability";
      }
    },
    liabilityName: {
      type: String,
      required: function () {
        return this.reference_type === "Liability";
      }
    },
    referenceId: {
      type: String,
      ref: "Liability",
      required: function () {
        return this.reference_type === "Liability";
      }
    }
  },
  refundInvestmentDetails: {
    description: {
      type: String,
      required: function () {
        return this.reference_type === "Refund/Investment";
      },
      trim: true
    },
    referenceId: {
      type: String,
      immutable : true,
      unique : true,
      required: function () {
        return this.reference_type === "Refund/Investment";
      },
      immutable: true
    }
  },
  maintenanceRepairDetails: {
    assetType: {
      type: String,
      enum: assetTypes,
      required: function () {
        return ["Maintenance", "Repair"].includes(this.reference_type);
      }
    },
    assetId: {
      type: String,
      ref: "Asset",
      required: function () {
        return ["Maintenance", "Repair"].includes(this.reference_type);
      }
    },
    referenceId: {
      type: String,
      ref: "Asset",
      required: function () {
        return ["Maintenance", "Repair"].includes(this.reference_type);
      }
    },
    
  },
  amount: {
    type: Number,
    required: true
  },
  transactionTypes: {
    type: String,
    enum: transactionTypes,
    required: true
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
    type : String // cloudnary Url
  }
}, { timestamps: true });

export const InternalTransaction = mongoose.model("InternalTransaction", internalTransactionSchema);
