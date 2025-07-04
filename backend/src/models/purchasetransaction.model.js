import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const REFERENCE_TYPES = [
    "Asset", 
    "Service"
];

const ACCOUNTS = [
    "N/A", 
    "Cash Account", 
    "Bank Account", 
    "Sales Account", 
    "Purchase Account",
    "Office Supplies Account",
    "Salary Account"
];

const ALLOWEDSTATUSES = [
    "Partially Paid",
    "Completed"
];

const MODES = ["Digital", "Cash", "Cheque"];

const SUBMODES= {
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

const TRANSACTION_TYPES= {
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

const purchaseSchema = new Schema ({
    transaction_id: {
        type: String,
        required: true,
        immutable: true,
        index: true,
        unique: true
    },

    enteredBy: { // Middleware
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
    },

    purchase_date: {
        type: Date,
        required: true,
    },

    vendor_type: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor',           
        required: true,
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    approval_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        immutable: true
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
        required: true
    },
    transaction_type: {
        type: String,
        enum: TRANSACTION_TYPES,
        required: true
    },
    transaction_mode: {
        type: String,
        enum: MODES,
        required: true
    },
    transaction_submode: {
        type: String,
        enum: SUBMODES,
        required: true
    },
    payment_id: {
        type: mongoose/Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    debit_account: {
        type: String,
        enum: ACCOUNTS,
        required: true
    },
    credit_account: {
        type: String,
        enum: ACCOUNTS,
        required: true
    },
    status: {
        type: String,
        enum: ALLOWEDSTATUSES,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    narration: {
        type: String
    },
    attachments: {
        type: String ////Cloudinary URL
    }
},
{
    timestamps: true
});

export const PurchaseTransaction = mongoose.model("Purchase",purchaseSchema);