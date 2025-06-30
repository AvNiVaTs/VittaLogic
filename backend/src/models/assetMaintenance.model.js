import mongoose, { Schema } from 'mongoose';

const maintenanceTypes = [
  'AMC',
  'Repair',
  'Routine Check',
  'Replacement',
  'Upgrade',
  'Other'
];

const allowedMaintenancePeriod = [
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
  "90 Days",
  "180 Days",
  "365 Days"
];

const assetMaintenanceSchema = new Schema({
  maintenanceId: {
    type: String,
    unique: true,
    immutable: true,
    required: true, 
    index : true
  },
    assetType : {
    type : mongoose.Schema.Types.ObjectId,
    ref : Asset,
    required : true
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
    enum: allowedMaintenancePeriod, 
    required: [true, 'Maintenance period is required']
  },

  nextMaintenanceDate: {
    type: Date // Middleware (automatic)
  },

  ServiceProviderName: {
    type: String,
    trim: true
  },

  StartDate: {
    type: Date
  },

  EndDate: {
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
      default: enteredBy,
      immutable: true
  }

}, { timestamps: true });

export const AssetMaintenance = mongoose.model('AssetMaintenance', assetMaintenanceSchema);