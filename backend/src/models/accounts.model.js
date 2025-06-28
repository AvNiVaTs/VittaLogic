const mongoose = require('mongoose');

const decimal = mongoose.Schema.Types.Decimal128;

const Account_type = [credit, debit]; //acceptable values for account type

const Medium = [cash, credit, cheque] //acceptable values for medium

const accountsSchema = new mongoose.Schema({
  account_id:{
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true,
    trim: true
  },
  account_type:{
    type: String,
    enum: Account_type, 
    required: true
  },
  medium:{
    type: String,
    enum: Medium, 
    required: true
  },
  is_primary:{
    type: Boolean,
    default: true,
    required: true
  },
  balance:{
    type: decimal,
    required: true,   //doubt, will it be calculated in the backend automatically or the user will update it?
    min: 0
  },
});

export const account = mongoose.model('Accounts',accountsSchema);