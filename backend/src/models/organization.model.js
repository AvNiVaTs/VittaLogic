import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema({
  Organization_Name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  PAN_No: {
    type: String,
    uppercase: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    required: false
  },
  Organization_Website_Link: {
    type: String,
    match: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/#?]?.*)$/,
    required: false
  },
  Organization_Email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  Contact_Number: {
    type: String,
    required: true,
    match: /^[0-9+\-() ]{7,20}$/ // allows international format
  },
  GSTIN: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },
  Organization_Address: {
    type: String,
    required: true,
    trim: true
  },
  Country: {
    type: String,
    required: true
  },
  Pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/ // Indian Pincode format
  },
  Bank_Name: {
    type: String,
    required: true,
    trim: true
  },
  IFSC_Code: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  Bank_Account_No: {
    type: String,
    required: true,
    match: /^[0-9]{9,18}$/
  }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
)
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
      _id: this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
)
}

export const Organziation = mongoose.model('Organization', organizationSchema);