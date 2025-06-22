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
    default: () => 'DEP-' + Date.now()
  },

  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },

  purchaseCost: { // Hooks and JWT auto Fetch
    type: Number,
    required: true
  },

  purchaseDate: { // Hooks and JWT auto Fetch
    type: Date,
    required: true
  },

  depreciationType: {
    type: String,
    enum: depreciationMethods,
    required: true
  },

  methodInputs: {
    type: Map,
    of: Schema.Types.Mixed, // Key-value dynamic structure
    required: true
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
  }

}, { timestamps: true });

export const AssetDepreciation = mongoose.model('AssetDepreciation', assetDepreciationSchema);
