import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const REFERENCE_TYPES = ["Asset", "Service"];

const VENDOR_TYPES = [
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


const ALLOWED_STATUS = [
  "Pending",
  "Partially Paid",
  "Completed",
  "Cancelled"
];

const MODES = ["Digital", "Cash", "Cheque"];

const SUB_MODES = {
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
  Cash: [
    "Cash Payment",
    "Cash Deposit",
    "Cash Withdrawal"
  ],
  Cheque: [
    "Cheque Issued",
    "Cheque Received",
    "Post-Dated Cheque",
    "Cancelled Cheque"
  ]
};

const TRANSACTION_TYPES = {
  Assets: [
    "Raw Material",
    "Machinery",
    "Vehicles",
    "IT Equipment",
    "Office Supplies",
    "Others"
  ],
  Services: [
    "Consulting",
    "Legal",
    "IT Services",
    "Training",
    "Security",
    "Subscriptions",
    "Others"
  ]
};

// Flattened enum for schema
const TRANSACTION_TYPE_ENUM = [
  ...TRANSACTION_TYPES.Assets,
  ...TRANSACTION_TYPES.Services
];

const purchaseSchema = new Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      immutable: true,
      index: true,
      unique: true
    },

    enteredBy: {
      type: String,
      ref: 'Employee',
      required: true,
      immutable: true
    },

    purchase_date: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: 'Purchase date cannot be in the future'
      }
    },

    vendor_type: {
      type: String,
      enum: VENDOR_TYPES,
      required: true
    },

    vendor_id: {
      type: String,
      ref: 'Vendor',
      required: true
    },

    approval_id: {
      type: String,
      ref: 'Approval',
      required: true
    },

    reference_type: {
      type: String,
      enum: REFERENCE_TYPES,
      required: true
    },

    reference_id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true
    },

    AssetDetails: {
      asset_name: {
        type: String,
        required: function () {
          return this.reference_type === "Asset";
        }
      },
      quantity: {
        type: Number,
        required: function () {
          return this.reference_type === "Asset";
        }
      }
    },

    ServiceDetails: {
      service_name: {
        type: String,
        required: function () {
          return this.reference_type === "Service";
        }
      },
      duration: {
        type: Number,
        required: function () {
          return this.reference_type === "Service";
        }
      }
    },

    purchase_amount: {
      type: decimal,
      required: true,
      validate: {
        validator: function (v) {
          return v && parseFloat(v.toString()) > 0;
        },
        message: 'Purchase amount must be greater than 0'
      },
      index: true
    },

    transaction_type: {
      type: String,
      enum: TRANSACTION_TYPE_ENUM,
      required: true,
      validate: {
        validator: function (v) {
          if (this.reference_type === "Asset") {
            return TRANSACTION_TYPES.Assets.includes(v);
          } else if (this.reference_type === "Service") {
            return TRANSACTION_TYPES.Services.includes(v);
          }
          return false;
        },
        message: props =>
          `Invalid transaction type '${props.value}' for reference type '${props.instance.reference_type}'`
      }
    },

    transaction_mode: {
      type: String,
      enum: MODES,
      required: true
    },

    transaction_submode: {
      type: String,
      enum: [].concat(...Object.values(SUB_MODES)),
      required: true
    },

    payment_id: {
      type: String,
      ref: 'VendorPayment',
      required: true
    },

    debit_account: {
      type: String,
      ref: 'FinancialAccount',
      required: true,
      default : "N/A"
    },

    credit_account: {
      type: String,
      ref: 'FinancialAccount',
      required: true,
      default : "N/A"
    },

    status: {
      type: String,
      enum: ALLOWED_STATUS,
      required: true
    },

    department: {
      type: String,
      ref: 'Department',
      required: true
    },

    narration: {
      type: String
    },

    attachments: {
      type: String // Cloudinary URL
    }
  },
  {
    timestamps: true
  }
);

export const PurchaseTransaction = mongoose.model("PurchaseTransaction", purchaseSchema);
