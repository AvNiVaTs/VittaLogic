import mongoose, { Schema } from 'mongoose';

const depreciationMethods = [
  'Straight Line Method',
  'Written Down Method',
  'Units of Production Method',
  'Double Declining Method',
  'Sum-of-the-Years Digits Method'
];

const assetDepreciationSchema = new Schema({
  depreciationId: {
    type: String,
    unique: true,
    immutable: true,
    required : true,
    index : true
  },
  assetType : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },

  purchaseCost: { // Hooks and JWT auto Fetch from Asset
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },

  purchaseDate: { // Hooks and JWT auto Fetch
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },

  depreciationMethod: {
    type: String,
    enum: depreciationMethods,
    required: true
  },

  // Common field across methods
  salvageValue: {
    type: Number,
    required: function () {
      return [
        'Straight Line Method',
        'Written Down Method',
        'Units of Production Method',
        'Double Declining Method',
        'Sum-of-the-Years Digits Method'
      ].includes(this.depreciationMethod);
    }
  },

  // Only for Straight Line and Double Declining, Sum-of-the-Years
  usefulLifeYears: {
    type: Number,
    required: function () {
      return [
        'Straight Line Method',
        'Double Declining Method',
        'Sum-of-the-Years Digits Method'
      ].includes(this.depreciationMethod);
    }
  },

  // Only for Written Down Method
  depreciationRate: {
    type: Number,
    required: function () {
      return this.depreciationMethod === 'Written Down Method';
    }
  },

  // Only for Units of Production Method
  totalExpectedUnits: {
    type: Number,
    required: function () {
      return this.depreciationMethod === 'Units of Production Method';
    }
  },

  actualUnitsUsed: {
    type: Number,
    required: function () {
      return this.depreciationMethod === 'Units of Production Method';
    }
  },

  // You can now extend it to include other common fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    immutable: true
  },

  depreciationAmount: {
    type: Number,
    min: [0, 'Depreciation amount must be non-negative']
  },

  currentBookValue: {
    type: Number,
    min: [0, 'Book value must be non-negative']
  },

  notes: {
    type: String,
    trim: true,
    maxlength: 300
  },

  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  }

}, { timestamps: true });

export const AssetDepreciation = mongoose.model('AssetDepreciation', assetDepreciationSchema);
