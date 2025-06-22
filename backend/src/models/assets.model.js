import mongoose, {Schema} from "mongoose";

const allowedAssetTypes = [
    "IT Equipment",
    "Office Furniture",
    "Machinery",
    "Vehicles",
    "Real Estate",
    "Electrical Appliances",
    "Software Licenses",
    "Miscellaneous"
  ];

const allowedAssetSubtypes = {
  'IT Equipment' : [
    "Laptop",
    "Desktop",
    "Monitor",
    "Printer",
    "Scanner",
    "Router",
    "Server",
    "Tablet",
    "Projector"
  ],
  'Office Furniture' : [
    "Chair",
    "Desk",
    "Conference Table",
    "Cabinet",
    "Bookshelf",
    "Partition",
    "Reception Desk"
  ],
  'Machinery' : [
    "CNC Machine",
    "Lathe Machine",
    "Compressor",
    "Drill Press",
    "Packaging Machine",
    "3D Printer"
  ],
  'Vehicles' : [
    "Car",
    "Motorcycle",
    "Truck",
    "Forklift",
    "Electric Scooter"
  ],
  'Real Estate' : [
    "Office Building",
    "Warehouse",
    "Factory",
    "Retail Space",
    "Land"
  ],
  'Electrical Appliances' : [
    "Air Conditioner",
    "Refrigerator",
    "Microwave",
    "Water Purifier",
    "Heater"
  ],
  'Software Licenses' : [
    "Operating System License",
    "Accounting Software",
    "Design Software",
    "Productivity Suite",
    "ERP License",
    "Antivirus Subscription"
  ],
  'Miscellaneous' : [
    "Security Camera",
    "Fire Extinguisher",
    "Whiteboard",
    "Tool Kit",
    "Other"
  ]
};

const assetAssign = ['Assigned' , 'Unassigned'];


const assetSchema = new Schema({
  assetId: {
    type: String,
    unique: true,
    default: () => 'AST-' + Date.now(),
    immutable: true
  },
  assetName: {
    type: String,
    required: true,
    trim: true
  },
  assetType: {
    type: String,
    enum: allowedAssetTypes,
    required: true
  },
  assetSubType: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return allowedAssetSubtypes[this.assetType]?.includes(val);
      },
      message: 'Invalid subtype for selected asset type.'
    }
  },
  assignedStatus: {
    type: String,
    enum: assetAssign,
    default: 'Unassigned'
  },
  purchaseFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v <= new Date();
      },
      message: 'Purchase date cannot be in the future'
    }
  },
  purchaseCost: {
    type: Number,
    required: true,
    min: [0, 'Purchase cost must be non-negative']
  },
  expectedUsefulLife: {
    type: Number,
    required: true,
    min: [0.1, 'Expected useful life must be at least 0.1 year']
  },
  numberOfDuplicates: {
    type: Number,
    default: 1,
    min: [1, 'At least one asset must be entered']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300
  },
  documents: [{
    type: String // URL or filename
  }],
  entered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    immutable: true
  }
}, { timestamps: true });

export const Asset = mongoose.model('Asset',assetSchema);