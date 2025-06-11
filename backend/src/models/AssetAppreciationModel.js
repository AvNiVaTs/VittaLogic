const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const assetappreciationSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: true,
    ref: 'Assets'
  },
  appreciation_id: {
    type: String,
    required: true,
    unique: true
  },
  appreciation_amount: {
    type: decimal,
    required: true
  },
  book_value: {
    type: decimal,
    required: true
  }
},
{
  timestamp: true
});

export const assetappreciation = mongoonse.model('Assetappreciation',assetappreciationSchema);