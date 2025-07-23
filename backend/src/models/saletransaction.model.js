import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

// Customer Types
const customerTypes = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",        //added finance and some other fields in enum
  "Education",
  "B2B",
  "B2C",
  "Enterprise",
  "SME",
  "Others",
];

// Transaction Types
const saleTransactionTypes = [
  "Product Sale", 
  "Service Sale", 
  "Asset Sale",
  "Scrap Sale", 
  "Software/License Sale", 
  "Other Sale"
];

// Asset Types
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

// Transaction Modes & Submodes
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


const saleTransactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  enteredBy: {
    type: String,
    ref: "Employee",
    required: true,
    immutable: true
  },
  updatedBy: {
    type: String,
    ref: "Employee"
  },
  saleDate: {
    type: Date,
    required: true
  },
  customerType: {
    type: String,
    enum: customerTypes,
    required: true
  },
  customerId: {
    type: String,
    ref: "Customer",
    required: true
  },
  paymentId: {
    type: String,
    ref: "CustomerPayment",
    required: true
  },
  approvalId: {
    type: String,
    ref: "Approval",
    required: true
  },
  saleName: {
    type: String,
    required: true,
    trim: true
  },
  referenceId: {
    type: String,
    default: () => `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    immutable: true
  },
  saleAmount: {
    type: decimal,
    required: true
  },
  transactionType: {
    type: String,
    enum: saleTransactionTypes,
    required: true
  },
  assetDetails: {
    assetType: {
      type: String,
      enum: assetTypes,
      required: function () {
        return this.transactionType === "Asset Sale";
      }
    },
    assetId: {
      type: String,
      ref: "Asset",
      required: function () {
        return this.transactionType === "Asset Sale";
      }
    },
    assetStatus: {
      type: String,
      ref : "Asset",
      immutable: true,
      required: function () {
        return this.transactionType === "Asset Sale";
      }
    },
    disposalId: {
      type: String,
      ref: "Asset",
      immutable : true,
      required: function () {
        return this.transactionType === "Asset Sale";
      }
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
    type: String // Cloudnary Url
  }
}, { timestamps: true });

export const SaleTransaction = mongoose.model("SaleTransaction", saleTransactionSchema);


// import mongoose, { Schema } from "mongoose";

// const decimal = mongoose.Schema.Types.Decimal128;

// const ACCOUNTS = [
//     "N/A", 
//     "Cash Account", 
//     "Bank Account", 
//     "Sales Account", 
//     "Purchase Account",
//     "Office Supplies Account",
//     "Salary Account"
// ];

// const ALLOWED_STATUS = [
//   "Pending", 
//   "Approved", 
//   "Completed", 
//   "Rejected", 
//   "On Hold"
// ];

// const MODES = ["Digital", "Cash", "Cheque"];

// const SUBMODES= {
//   Digital: [
//     "NEFT",
//     "RTGS",
//     "IMPS",
//     "UPI",
//     "Bank Transfer",
//     "Credit Card",
//     "Debit Card",
//     "Online Wallet",
//     "Net Banking"
//   ],
//   Cash:  [
//     "Cash Payment",
//     "Cash Deposit",
//     "Cash Withdrawal"
//   ],
//   Cheque:  [
//     "Cheque Issued",
//     "Cheque Received",
//     "Post-Dated Cheque",
//     "Cancelled Cheque"
//   ]
// };

// const TRANSACTION_TYPES= {
//     Assets: [
//     "Raw Material", 
//     "Machinery", 
//     "Vehicles", 
//     "IT Equipment", 
//     "Office Supplies",
//     "Others"
//     ],
//     Serives: [
//     "Consulting",
//     "Legal",
//     "IT Services",
//     "Training",
//     "Security",
//     "Subscriptions",
//     "Others"
//     ]
// };

// const saleSchema = new Schema ({
//     transaction_id: {
//         type: String,
//         required: true,
//         immutable: true,
//         index: true,
//         unique: true
//     },

//     enteredBy: { // Middleware
//         type: String,
//         ref: 'Employee',
//         required: true,
//         immutable: true
//     },

//     sale_date: {
//         type: Date,
//         required: true,
//     },

//     customer_type: {
//         type: String, ///////NEED HELP HERE////////
//         ref: 'Customer',           //////////DOUBT//////////
//         required: true,
//     },

//     customer_id: {
//         type: String,
//         ref: 'Customer',
//         required: true
//     },

//     approval_id: {
//         type: String,
//         ref: 'Approval',
//     },

//     sale_name: {
//         type: String,
//         required: true
//     },

//     sale_amount: {
//         type: decimal,
//         required: true
//     },

//     transaction_type: {
//         type: String,
//         enum: TRANSACTION_TYPES,
//         required: true
//     },
//     transaction_mode: {
//         type: String,
//         enum: MODES,
//         required: true
//     },
//     transaction_submode: {
//         type: String,
//         enum: SUBMODES,
//         required: true
//     },
//     payment_id: {
//         type: String,
//         ref: 'Vendor',
//         required: true
//     },
//     debit_account: {
//         type: String,
//         enum: ACCOUNTS,
//         required: true
//     },
//     credit_account: {
//         type: String,
//         enum: ACCOUNTS,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ALLOWED_STATUS,
//         required: true
//     },
//     department: {
//         type: String,
//         ref: 'Department',
//         required: true,
//     },
//     narration: {
//         type: String
//     },
//     attachments: {
//         type: String ////Cloudinary URL
//     }
// },
// {
//     timestamps: true
// });

// export const SaleTransaction = mongoose.model("Sale", saleSchema);