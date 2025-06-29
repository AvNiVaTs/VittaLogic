import mongoose, { Schema } from 'mongoose';

const maintenanceTypes = [
  'AMC',
  'Repair',
  'Routine Check',
  'Replacement',
  'Upgrade',
  'Other'
];

const assetMaintenanceSchema = new Schema({
  maintenanceId: {
    type: String,
    unique: true,
    immutable: true,
    default: () => `MTN-${Date.now()}`,
    index : true
  },

  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset reference is required']
  },

  maintenanceType: {
    type: String,
    enum: maintenanceTypes,
    required: [true, 'Maintenance type is required']
  },

  lastServiceDate: {
    type: Date,
    required: [true, 'Last service date is required']
  },

  maintenancePeriod: {
    type: Number,
    required: [true, 'Maintenance period is required'],
    min: [0.1, 'Maintenance period must be at least 0.1 month'],
    validate: {
      validator: v => /^\d+(\.\d{1,2})?$/.test(v.toString()),
      message: 'Maintenance period must have up to 2 decimal places'
    }
  },

  nextMaintenanceDate: {
    type: Date // Middleware (automatic)
  },

  amcProviderName: {
    type: String,
    trim: true
  },

  amcStartDate: {
    type: Date
  },

  amcEndDate: {
    type: Date,
    validate: {
      validator: function (v) {
        return !this.amcStartDate || v >= this.amcStartDate;
      },
      message: 'AMC end date cannot be before start date'
    }
  },

  costOfMaintenance: {
    type: Number,
    required: true,
    min: [0, 'Maintenance cost must be a non-negative value']
  },

  serviceNote: {
    type: String,
    trim: true,
    maxlength: [300, 'Service note cannot exceed 300 characters']
  },

  documents: [{ // Cloudnary
    type: String // store file URLs or paths
  }],

  enteredBy: { //Middleware
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

}, { timestamps: true });

export const AssetMaintenance = mongoose.model('AssetMaintenance', assetMaintenanceSchema);