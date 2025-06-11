const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const vendorpaymentschema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: true,
    ref: 'Transactions'
  },
  payment_id: {      //should be payment_id since it is pk
    tpye: String,
    required: true,
  },
  payment_date: {
    type: Date,
    required:true
  },
  amount: {
    type: decimal,
    required: true
  },
  payment_method: {
    type: String,    //should be enum type
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  vendor_id: {
    type: String,
    required: true,
    ref: 'Vendors'
  }
});

export const customerpayments = mongoose.model('CustomerPayments',vendorpaymentschema);