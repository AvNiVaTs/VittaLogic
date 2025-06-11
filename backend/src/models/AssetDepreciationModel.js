const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const depreciation_types = ["Straight-Line Depreciation", "Units of Production Depreciation", 
  "Double Declining Balance Depreciation", "Sum-of-the-Years Digits Depreciation"];

const assetdepreciationSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: true,
    ref: 'Assets'
  },
  //transaction_id: {},  //ye kaha kaise aaya? book value decrease hui hai bas actual mein koi transaction nhi hua
  depreciation_id: {
    type: String,
    required: true,
    unique: true
  },
  depreciation_type: {
    type: String,
    enum: depreciation_types,
    required: true
  },
  depreciation_amount: {
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

export const assetdepreciation = mongoonse.model('AssetDepreciation',assetdepreciationSchema);