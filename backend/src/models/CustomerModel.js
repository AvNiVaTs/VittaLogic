import mongoose, { Schema } from "mongoose";

const CUSTOMER_TYPES = [
  "Technology", 
  "Manufacturing", 
  "Retail", 
  "Healthcare", 
  "Education", 
  "B2B", 
  "B2C", 
  "Enterprise", 
  "SME",
  "Others"  //added others field
];

const CUSTOMER_LOCATIONS = [
  'Indian', 
  'International'
];

const INDIAN_CUSTOMER_SEGMENTS = [
  "Premium", 
  "Regular", 
  "One-time"
];

const INDIAN_SHIPPING_METHODS = [
  "Road", 
  "Rail", 
  "Air"
];

const INTERNATIONAL_CUSTOMER_PRIORITIES = [
  "Low", 
  "Medium", 
  "High"
];

const INTERNATIONAL_SHIPPING_METHODS = [
  "Road", 
  "Rail", 
  "Air", 
  "Ship"
];

const INTERNATIONAL_CURRENCIES = [
  "USD", 
  "EUR", 
  "GBP", 
  "JPY", 
  "AUD",
  "CAD", 
  "CHF", 
  "CNY", 
  "INR"
];

const INTERNATIONAL_TAX_PROFILES = [
  "VAT", 
  "Sales Tax"
];

const customerSchema = new Schema({
  customer_Id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    immutable: true
  },

  company_Name: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String, 
    required: true
  },

  company_Email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },

  customer_Types: {
    type: [String],
    required: true,
    enum: CUSTOMER_TYPES
  },

  contact_Person: {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/
    },
    number: {
      type: String,
      required: true,
      match: /^[0-9+\-() ]{7,20}$/
    }
  },

  customer_Location: {
    type: String,
    enum: CUSTOMER_LOCATION,
    required: true
  },

  // Shared Additional Fields
  industry_Sector: { 
    type: String 
  },
  billing_Address: { 
    type: String 
  },
  receiver_Name: { 
    type: String 
  },
  receiver_ContactNo: {
    type: String,
    match: /^[0-9+\-() ]{7,20}$/
  },
  shipping_Addresses: {
    type: [String], //type: [String] tells Mongoose that this field is an array of strings
    validate: v => Array.isArray(v) && v.length > 0
  },
  created_By: {
    type: String,
    required: true
  },

  // Indian-only Fields
  indian_Details: {
    stateProvince: { 
      type:String 
    },
    customer_Segment: {
      type: String,
      enum: INDIAN_CUSTOMER_SEGMENTS
    },
    preferred_Shipping_Method: {
      type: String,
      enum: INDIAN_SHIPPING_METHODS
    },
    bank_AccountNumber: {
      type: String,
      match: /^[0-9]{9,18}$/,
      sparse: true,
      unique: true
    },
    bank_Name: {
      type: String 
    },
    bank_Branch: { 
      type:String 
    },
    ifsc_Code: {
      type: String,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/
    },
    account_HolderName: { 
      type: String 
    },
    gstin: {
      type: String,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      sparse: true,
      uppercase: true
    },
    pan_Number: {
      type: String,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      sparse: true,
      uppercase: true
    }
  },

  // International-only Fields
  internationalDetails: {
    TIN_VAT_EIN_Company_RegNo: { 
      type: String 
    },
    customerPriority: {
      type: String,
      enum: INTERNATIONAL_CUSTOMER_PRIORITIES
    },
    preferredShippingMethod: {
      type: String,
      enum: INTERNATIONAL_SHIPPING_METHODS
    },
    defaultCurrency: {
      type: String,
      enum: INTERNATIONAL_CURRENCIES
    },
    applicableTaxProfile: {
      type: String,
      enum: INTERNATIONAL_TAX_PROFILES
    },
    countryName: { 
      type: String 
    },
    bankName: {
      tpye: String 
    },
    ibanOrAccountNumber: {
      type: String,
      match: /^[A-Z0-9]{15,34}$/,
      sparse: true,
      unique: true
    },
    swiftCode: {
      type: String,
      match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
    },
    bankAddress: { 
      type: String 
    },
    beneficiaryName: {
      type: String 
    },
    iecCode: {
      type: String,
      match: /^[A-Z0-9]{10}$/i
    }
  }

});

export const customer = mongoose.model('Customer', vendorschema);