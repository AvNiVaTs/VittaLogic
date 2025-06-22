import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ApiErr } from "../utils/ApiError.js"

// === Organization Schema ===
const organizationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  panNumber: {
    type: String,
    uppercase: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    sparse: true
  },
  website: {
    type: String,
    match: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/#?]?.*)$/,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9+\-() ]{7,20}$/
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/ // Indian Pincode
  },

  // === Authorized Person Details ===
  authorizedPerson: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    designation: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9+\-() ]{7,20}$/
    },
    password: {
      type: String,
      required: true,
      select: false // excludes password by default in queries
    },
    confirmpassword: {
      type: String,
      required: true,
      select: false
    },
  },

  // === Bank Details ===
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  bankAccountNumber: {
    type: String,
    required: true,
    match: /^[0-9]{9,18}$/
  }
}, {timestamps: true});

// ====== Password Encryption ======
organizationSchema.pre("save", async function (next) {
  const authorized = this.authorizedPerson

  if(authorized && authorized.password && authorized.confirmpassword && (authorized.password !== authorized.confirmpassword)){
    return next(new ApiErr(401, "Password and confirm password doesn't match"))
  }

  if(this.isModified("authorizedPerson.password")){
    authorized.password = await bcrypt.hash(authorized.password, 10)
    authorized.confirmpassword = undefined//clear confirm password
  }
  next()
})

// ====== Check Password ======
organizationSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.authorizedPerson.password)
}

organizationSchema.methods.generateAccessToken = function(){
  return jwt.sign({
      _id: this._id,
      email: this.email,
      organizationName: this.organizationName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
)
}

organizationSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
      _id: this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
)
}

export const Organization = mongoose.model('Organization', organizationSchema);