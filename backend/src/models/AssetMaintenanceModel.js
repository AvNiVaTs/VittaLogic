const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const assetmaintenanceSchema = mongoose.Schema({
  maintenance_id: {
    type: String,
    required: true,
    unique: true
  },
  asset_id: {
    type: String,
    required: true,
    ref: 'Assets'
  },
  annual_maintenance_due_date: {
    type: Date,
    required: true,
  },
  maintenance_charges: {
    type: decimal,
    required: true,
    min: 0
  },
  performed_by: {
    type: String,
    required: true
  },
  transaction_id: {
    type: String,
    required: true,
    ref: 'Transactions'
  }
});

export const assetmaintenance = mongoose.model('AssetMaintenance',assetmaintenanceSchema);