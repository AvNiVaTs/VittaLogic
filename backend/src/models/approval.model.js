import mongoose, { Schema } from "mongoose";

const decimal = mongoose.Schema.Types.Decimal128;

const PRIORITIES = [
  "Low", 
  "Medium", 
  "High"
];

const STATUS = [
  "Pending", 
  "Approved", 
  "Rejected", 
  "On Hold", 
];

const APPROVALFOR = [
    "Asset",
    "Liability",
    "Customer Payment",
    "Vendor Payment",
    "Salary",
    "Department Budget",
    "Service"
];

const approvalSchema = new Schema({
    approval_id: {
        type: String,
        required: [true, 'Approval ID is required'],
        unique: true,
        immutable: true,
        index : true
    },
    approval_to: {                               //Employee id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required : true
    },
    approvalfor: {
        type: String,
        enum: APPROVALFOR,
        required: true
    },
    approval_created_by: {                    //approval sender employee id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Approval creator is required'],

    },
    min_expense: {
        type: decimal,
        required: [true, 'Minimum expense is required'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Minimum expense must be non-negative'
        }
    },
    max_expense: {
        type: decimal,
        required: [true, 'Maximum expense is required'],
        validate: [
            {
                validator: function(v) {
                    return v >= 0;
                },
                message: 'Maximum expense must be non-negative'
            },
            {
                validator: function(v) {
                    if (this.min_expense) {
                        const minValue = parseFloat(this.min_expense.toString());
                        const maxValue = parseFloat(v.toString());
                        return maxValue >= minValue;
                    }
                    return true;
                },
                message: 'Maximum expense must be greater than or equal to minimum expense'
            }
        ]
    },
    priority: {
        type: String,
        enum: {
            values: PRIORITIES,
            message: 'Priority must be one of: {VALUES}'
        },
        required: [true, 'Priority is required'],
        index: true
    },
    tentative_date: {
        type: Date,
        required: [true, 'Tentative date is required'],
        validate: {
            validator: function(v) {
                return v >= new Date();
            },
            message: 'Tentative date must be in the future'
        },

    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        maxLength: [500, 'Reason cannot exceed 500 characters'],
        validate: {
            validator: function(v) {
                return v && v.trim().length > 0;
            },
            message: 'Reason cannot be empty'
        }
    },
    status: {
        type: String,
        enum: {
            values: STATUS,
            message: 'Status must be one of: {VALUES}'
        },
        required: [true, 'Status is required'],
        default: "Pending",
        index: true,
    },
    approver_note: {
        type: String,
        maxLength: [300, 'Approver note cannot exceed 300 characters'],
    },
    decision_time: {
        type: Date,
        index: true
    },
    decision_date: {
        type: Date,
        index: true
    }
} ,  {timestamps : true});

export const Approval = mongoose.model('Approval', approvalSchema);