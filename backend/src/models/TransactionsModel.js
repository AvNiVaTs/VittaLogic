import mongoose, { Schema } from 'mongoose';

const allowedTypes = ["Income", "Expenses", "Transfer", "Investments"];
const allowedSubTypes = {
  Income: [
    "Sales Revenue",
    "Interest Income",
    "Dividend Income",
    "Rental Income",
    "Refund Received",
    "Commission Received",
    "Investment Gain",
    "Miscellaneous Income"
  ],
  Expenses: [
    "Office Supplies",
    "Travel & Lodging",
    "Salaries & Wages",
    "Utility Bills",
    "Rent",
    "Professional Fees",
    "Marketing & Advertising",
    "Insurance Premiums",
    "Software Subscriptions",
    "Repairs & Maintenance",
    "Loan Interest Paid",
    "Miscellaneous Expense"
  ],
    Transfer:  [
    "Bank to Cash",
    "Cash to Bank",
    "Inter-departmental Transfer",
    "Account Reconciliation",
    "Internal Adjustment",
    "Currency Conversion",
    "Opening Balance Transfer"
    ],
  Investments: [
    "Equity Purchase",
    "Mutual Funds Investment",
    "Fixed Deposit",
    "Bonds Purchase",
    "Real Estate Investment",
    "Reinvestment of Returns",
    "Asset Acquisition",
    "SIP (Systematic Investment Plan)"
]
};

const allowedModeCategories = ["Digital", "Cash", "Cheque"];
const allowedModes = {
  Digital: [
    "NEFT",
    "RTGS",
    "IMPS",
    "UPI",
    "Bank Transfer",
    "Credit Card",
    "Debit Card",
    "Online Wallet",
    "Net Banking"
  ],
  Cash:  [
    "Cash Payment",
    "Cash Deposit",
    "Cash Withdrawal"
  ],
  Cheque:  [
    "Cheque Issued",
    "Cheque Received",
    "Post-Dated Cheque",
    "Cancelled Cheque"
  ]
};

const allowedStatuses = ['Pending', 'Completed', 'Failed'];

const transactionSchema = new Schema({
  transactionId: {
    type: String,
    default: () => 'TXN-' + Date.now(),
    unique: true,
    immutable: true
  },
  enteredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  transactionDate: {
    type: Date,
    required: true,
    validate: {
      validator: (v) => v instanceof Date && !isNaN(v) && v <= new Date(),
      message: 'Transaction Date cannot be in the future'
    }
  },
  transactionType: {
    type: String,
    enum: allowedTypes,
    required: true
  },
  transactionSubType: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return allowedSubTypes[this.transactionType]?.includes(val);
      },
      message: 'Invalid SubType for the selected Type'
    }
  },
  transactionModeCategory: {
    type: String,
    enum: allowedModeCategories,
    required: true
  },
  transactionMode: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return allowedModes[this.transactionModeCategory]?.includes(val);
      },
      message: 'Invalid Transaction Mode for the selected Mode Category'
    }
  },
  transactionFor: [{
    type: Schema.Types.ObjectId,
    required: true
    // No ref here as it links to multiple models
  }],
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
    // Populate this server-side using logic
  },
  debitAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  creditAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  status: {
    type: String,
    enum: allowedStatuses,
    required: true
  },
  narration: {
    type: String,
    trim: true,
    maxlength: 300
  }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);
