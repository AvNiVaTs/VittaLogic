import mongoose, { Schema } from "mongoose";

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

const allowedStatus = [
  "Active",
  "Maintenance Needed",
  "Under Repair",
  "Under Maintenance",
  "Disposed",
  "Unoperational"
];

const assetAssign = ['Assigned' , 'Unassigned', 'NA'];


const assetSchema = new Schema({
  assetId: {
    type: String,
    unique: true,
    immutable: true,
    required : true,
    index : true
  },
  linked_reference_id : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
  },
  assetName: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
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
    required: true,
    default: 'Unassigned'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedToDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  status: {
    type: String,
    enum: allowedStatus,
    required: true,
    default: "Active"
  },
  purchaseFrom: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
  },
  purchaseDate: { // from created on field
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
  },
  purchaseCost: { // cost_per_unit
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
  },
  numberOfAssets: { // quantity
    type : mongoose.Schema.Types.ObjectId,
    ref : 'EnteredAsset',
    immutable: true,
    required : true
  },
  description: {
    type: String,
    trim: true,
    maxLength: 300
  },
  documents: {
    type: String // URL or filename
  },
  enteredBy: { //Middleware
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
}, { timestamps: true });

export const Asset = mongoose.model('Asset',assetSchema);