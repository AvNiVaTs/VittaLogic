const mongoose = require('mongoose');

const bankDetailsSchemaV = new mongoose.Schema({
  bank_name: { type: String },
  account_number: { type: String },
  ifsc_code: { type: String },
  swift_code: { type: String },         // for international vendors
  iban: { type: String },               // optional - for some foreign vendors
  currency: { type: String }            // e.g., INR, USD, EUR
}, { _id: false });

const vendorSchema = new mongoose.Schema({
  vendor_id: {
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
    required: false // e.g., 'manufacturer', 'supplier', etc.
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
    type: bankDetailsSchemaV,
    required: false // optional, but recommended to validate before saving
  },
  tax_id: {
    type: String,
    required: function () {
      return !this.is_international; // required only for national vendors
    },
    unique: true,
    sparse: true // allows null values to skip the uniqueness constraint
  }
});

export const vendor = mongoose.model('Vendors',vendorschema);

//earlier model
/*
const vendorschema = new mongoose.Schema({
  vendor_id: {
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
    required: false //false for now
  },
  contact_person: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: false //false for now
  },
  email: {
    type: String,
    required: true
  },
  //bank_details: {}, ///// ALOT OF DOUBTS REGARDING THIS ONE.
                      ///// FIRST, WE REQUIRE MULTIPLE COLUMNS FOR BANK NAME, ACC NO., IFSC CODE, ETC.
                      ///// SECOND, DO WE NEED BOOLEAN VALUE COLUMN FOR DETERMINING WHETHER THE VENDOR IS NATIONAL OR INTERNATIONAL.
                      ///// THIRD, INTERNATIONAL VENDOR BANK DETAILS WOULD BE DIFFERENT FROM THE NATIONAL VENDOR.
  tax_id: {
    type: String,
    required: true,
    unique: true       // all vendors will have different gstin no. //international vendors will not have gstin then what to do?
  }
});
*/

