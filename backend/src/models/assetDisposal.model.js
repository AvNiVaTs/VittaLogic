import mongoose, { Schema } from 'mongoose';

const disposalStatusEnum = ['Profit', 'Loss', 'No Gain'];

const assetDisposalSchema = new Schema({
  disposalId: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
    index : true
  },

  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset is required for disposal']
  },

  purchaseAmount: { //Hooks : AUTO FETCH + JWT
    type: Number,
    required: true,
    min: [0, 'Purchase amount must be non-negative']
  },

  disposalAmount: {
    type: Number,
    required: true,
    min: [0, 'Disposal amount must be non-negative']
  },

  profitLossAmount: { // Auto Fetch + JWT
    type: Number
    // will be auto-calculated
  },

  status: { // Auto Fetch + JWT
    type: String,
    enum: disposalStatusEnum
    // auto-set
  },

  buyerInformation: {
    type: String,
    trim: true,
    maxlength: [200, 'Buyer info must be under 200 characters']
  },

  reasonForDisposal: {
    type: String,
    trim: true,
    maxlength: 300
  },
  Attachment: {  //cloudinary url
    type: String
  },
  
  enteredBy: { // middleware
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  }

}, { timestamps: true });

export const AssetDisposal = mongoose.model('AssetDisposal', assetDisposalSchema);