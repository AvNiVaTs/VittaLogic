const mongoose = require('mongoose');

const bankDetailsSchemaC = new mongoose.Schema({
  bank_name: { type: String },
  account_number: { type: String },
  ifsc_code: { type: String },
  swift_code: { type: String },         // for international vendors
  iban: { type: String },               // optional - for some foreign vendors
  currency: { type: String }            // e.g., INR, USD, EUR
}, { _id: false });

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false // e.g., 'retailer', 'distributor', etc.
  },
  contact_person: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  is_international: {
    type: Boolean,
    required: true
  },
  bank_details: {
    type: bankDetailsSchemaC,
    required: false // optional, but recommended to validate before saving
  },
  tax_id: {
    type: String,
    required: function () {
      return !this.is_international; // required only for national customer
    },
    unique: true,
    sparse: true // allows null values to skip the uniqueness constraint
  }
});

export const customer = mongoose.model('Customers',vendorschema);