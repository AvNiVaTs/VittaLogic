const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const assetdisposalSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: true,
    ref: 'Assets'
  },
  disposal_id: {
    type: String,
    required: true,
    unique: true
  },
  sale_amount: {
    type: decimal,
    required: true,
    min: 0
  },
  book_value_at_sale: {
    type: decimal,
    required: true,
    min: 0
  },
  capital_gain_loss: {
    type: decimal,
    required: true
  },
  reason: {
    type: String,
    required: false
  },
  transaction_id: {
    type: String,
    required: true,
    ref: 'Transactions'
  }
});

export const assetdisposal = mongoose.model('AssetDisposal',assetdisposalSchema);