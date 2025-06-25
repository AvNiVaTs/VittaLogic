import mongoose from "mongoose";

const Vendor_types = [
  "Technology", 
  "Manufacturing", 
  "Software", 
  "Hardware", 
  "Services", 
  "Consulting", 
  "Export", 
  "Import", 
  "Retail", 
  "Wholesale", 
  "Construction", 
  "Healthcare",
  "Others" //added others it was not in the front end
];

const Vendor_location = [
  "Indian", 
  "International"
];

const vendorSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  company_Name: {
    type: String,
    required: true,
    trim: true
  },
  company_Address: {
    type: String,
    required: true
  },
  vendor_type: {
    type: String,
    enum: Vendor_types,
    required: true //added others in the enum list
  },
  contactPerson: {
    name: { 
      type: String, 
      required: true 
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
      match: /^[0-9+\-() ]{7,20}$/ }
  },
  vendor_location: {
    type: String,
    enum: Vendor_location,
    required: true
  },
  indianBankDetails: {
    bankAccountNumber: {
      type: String,
      unique: true,
      sparse: true, // allows null values to skip the uniqueness constraint
      match: /^[0-9]{9,18}$/ // basic bank account number check
    },
    bankName: { 
      type: String 
    },
    bankBranch: { 
      type: String 
    },
    ifscCode: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/ // typical IFSC pattern
    },
    accountHolderName: { 
      type: String 
    },
    taxId: { 
      type: String 
    },
    panNumber: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ // PAN format
    }
  },

  internationalBankDetails: {
    countryName: { 
      type: String 
    },
    bankName: { 
      type: String 
    },
    ibanOrAccountNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: /^[A-Z0-9]{15,34}$/ // loose IBAN/account format
    },
    swiftBicCode: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/ // SWIFT/BIC pattern
    },
    bankAddress: { 
      type: String 
    },
    beneficiaryName: { 
      type: String 
    },
    currency: { 
      type: String 
    },
    exchangeRate: { 
      type: Number, min: 0 
    },
    iecCode: {
      type: String,
      match: /^[A-Z0-9]{10}$/i // 10 character IEC code
    }
  }
});

export const Vendor = mongoose.model('Vendor', vendorSchema);

