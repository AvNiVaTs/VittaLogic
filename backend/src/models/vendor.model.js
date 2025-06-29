import mongoose ,  {Schema} from "mongoose";

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
  "Liability",
  "Others" //added others it was not in the front end
];

const Vendor_location = [
  "Indian", 
  "International"
];

const vendorSchema = new Schema({
  vendor_id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    index : true
  },
  company_Name: {
    type: String,
    required: true,
    trim: true,
    index : true
  },
  company_Address: {
    type: String,
    required: true
  },
  vendor_type: {
    type: String,
    enum: Vendor_types,
    required: true,
    index : true //added others in the enum list
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
      match: /^[0-9]{9,18}$/, // basic bank account number check
      required: function () {            //function that checks if the vendor location is indian. if true then required becomes true
        return this.vendor_location === "Indian";
      }
    },
    bankName: { 
      type: String,
      required: function () {
        return this.vendor_location === "Indian";
      }
    },
    bankBranch: { 
      type: String,
      required: function () {
        return this.vendor_location === "Indian";
      }
    },
    ifscCode: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/, // typical IFSC pattern
      required: function () {
        return this.vendor_location === "Indian";
      }
    },
    accountHolderName: { 
      type: String,
      required: function () {
        return this.vendor_location === "Indian";
      }
    },
    taxId: { 
      type: String,
    },
    panNumber: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN format
    }
  },

  internationalBankDetails: {
    countryName: { 
      type: String,
      required: function () {
        return this.vendor_location === "International";
      }
    },
    bankName: { 
      type: String,
      required: function () {
        return this.vendor_location === "International";
      } 
    },
    ibanOrAccountNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: /^[A-Z0-9]{15,34}$/, // loose IBAN/account format
      required: function () {
        return this.vendor_location === "International";
      }
    },
    swiftBicCode: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, // SWIFT/BIC pattern
      required: function () {
        return this.vendor_location === "International";
      }
    },
    bankAddress: { 
      type: String,
      required: function () {
        return this.vendor_location === "International";
      } 
    },
    beneficiaryName: { 
      type: String, 
      required: function () {
        return this.vendor_location === "International";
      }
    },
    currency: { 
      type: String,
      required: function () {
        return this.vendor_location === "International";
      }
    },
    iecCode: {
      type: String,
      match: /^[A-Z0-9]{10}$/i, // 10 character IEC code
    }
  },
  createdBy: { //Middleware
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  },
  updatedBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      immutable: true
  }
}, {timestamps: true});

export const Vendor = mongoose.model('Vendor', vendorSchema);