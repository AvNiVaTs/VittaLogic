import mongoose, { Schema } from "mongoose";

// Enum for Asset Types
const assetTypes = [
  "IT Equipment",
  "Office Furniture",
  "Machinery",
  "Vehicles",
  "Real Estate",
  "Electrical Appliances",
  "Software Licenses",
  "Miscellaneous"
];

// Enum for Subtypes
const allowedAssetSubtypes = {
  "IT Equipment": [
    "Laptop", 
    "Desktop", 
    "Monitor", 
    "Printer", 
    "Scanner",
    "Router", 
    "Server", 
    "Tablet", 
    "Projector", 
    "Other"
  ],
  "Office Furniture": [
    "Chair", 
    "Desk", 
    "Conference Table", 
    "Cabinet", 
    "Bookshelf",
    "Partition", 
    "Reception Desk", 
    "Other"
  ],
  "Machinery": [
    "CNC Machine", 
    "Lathe Machine", 
    "Compressor", 
    "Drill Press",
    "Packaging Machine", 
    "3D Printer", 
    "Other"
  ],
  "Vehicles": [
    "Car", 
    "Motorcycle", 
    "Truck", 
    "Forklift", 
    "Electric Scooter", 
    "Other"
  ],
  "Real Estate": [
    "Office Building", 
    "Warehouse", 
    "Factory", 
    "Retail Space", 
    "Land", 
    "Other"
  ],
  "Electrical Appliances": [
    "Air Conditioner", 
    "Refrigerator", 
    "Microwave", 
    "Water Purifier", 
    "Heater", 
    "Other"
  ],
  "Software Licenses": [
    "Operating System License", 
    "Accounting Software", 
    "Design Software",
    "Productivity Suite", 
    "ERP License", 
    "Antivirus Subscription", 
    "Other"
  ],
  "Miscellaneous": [
    "Security Camera", 
    "Fire Extinguisher", 
    "Whiteboard", 
    "Tool Kit", 
    "Other"
  ]
};

// Enums for other fields
const assignmentStatuses = [
  "Assigned", 
  "Unassigned"
];

const assetStatuses = [
  "Active",
  "Repair Needed",
  "Maintenance Needed",
  "Under Repair",
  "Under Maintenance",
  "Awaiting Disposal",
  "Disposed"
];

const maintenanceTypes = [
  "Maintenance Needed",
  "Repair Needed"
];

const maintenancePeriod = [
  "15 Days", 
  "30 Days", 
  "45 Days", 
  "60 Days", 
  "90 Days", 
  "180 Days", 
  "365 Days"
];

const requestTypes = [
  "Maintenance", 
  "Repair"
];

const requestStatuses = [
  "Requested", 
  "In Progress", 
  "Completed"
];

const depreciationMethod = [
  "Straight Line Method",
  "Written Down Method",
  "Units of Production Method",
  "Double Declining Method",
  "Sum-of-the-Years Digits Method"
]

const assetSchema = new Schema({
  assetId: { 
    type: String,
    unique: true,
    immutable: true,
    required : true,
    index : true
 },

  linkedreferenceId: { 
    type: String , 
    ref: "PurchaseTransaction", 
    required: true 
  },
  assetName: { 
    type: String, 
    ref: "PurchaseTransaction" , 
    required: true 
  },

  assetType: {
    type: String,
    enum: assetTypes,
    required: true
  },

  assetSubtype: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const validSubtypes = allowedAssetSubtypes[this.assetType];
        return validSubtypes ? validSubtypes.includes(value) : false;
      },
      message: props =>
        `${props.value} is not a valid subtype for asset type ${props.instance.assetType}`
    }
  },

  vendorId: { 
    type: String , 
    ref: "PurchaseTransaction", 
    required: true 
  },
  purchaseCost: { 
    type: Number, 
    ref: "PurchaseTransaction", 
    required: true 
  },
  numberOfAssets: { 
    type: Number, 
    ref: "PurchaseTransaction", 
    required: true 
  },
  unitCost: { 
    type: Number, 
    required: true 
  },
  purchaseDate: { 
    type: Date, 
    ref: "PurchaseTransaction", 
    required: true 
  },

  description: { 
    type: String ,
    trim : true
  },
  documents: [{ 
    type: String 
  }], //Cloudnary url

  assignmentStatus: {
    type: String,
    enum: assignmentStatuses,
    default: "Unassigned"
  },

  assignedDepartment: {
    type: String,
    ref: "Department",
    required: function () {
      return this.assignmentStatus === "Assigned";
    }
  },

  assignedToEmployee: {
    type: String,
    ref: "Employee",
    required: function () {
      return this.assignmentStatus === "Assigned";
    }
  },

  status: {
    type: String,
    enum: assetStatuses,
    default: "Active"
  },

  maintenanceDetails: {
    maintenanceId: { 
      type: String,
      index: { unique: true, sparse: true },
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    maintenanceType: { 
      type: String, 
      enum: maintenanceTypes,
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    maintenancePeriod: { 
      type: String, 
      enum: maintenancePeriod,
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    serviceProvider: { 
      type: String,
      trim : true

    },
    serviceStartDate: { 
      type: Date,
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    serviceEndDate: { 
      type: Date,
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    serviceNote: { type: String , trim : true}, // optional

    requestType: { 
      type: String, 
      enum: requestTypes
    },
    requestStatus: { 
      type: String, 
      enum: requestStatuses
    },
    transactionId: {
      type: String,
      ref: "InternalTransaction"
    },
    maintenanceCost: {
      type: Number,
      ref: "InternalTransaction"
    },
    createdBy: {
      type: String,
      ref: "Employee",
      required: function () {
        return ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"].includes(this.status);
      }
    },
    updatedBy: {
      type: String,
      ref: "Employee"
    }
  },


  disposalDetails: {
    disposalId: { 
      type: String,
      index: { unique: true, sparse: true },
      required: function () {
        return ["Awaiting Disposal", "Disposed"].includes(this.status);
      }
    },
    disposalReason: { 
      type: String,
      trim : true,
      required: function () {
        return ["Awaiting Disposal", "Disposed"].includes(this.status);
      }
    },
    transactionId: {
      type: String,
      ref: "SaleTransaction",
      unique: true,
      index: true,
      required: function () {
        return ["Disposed"].includes(this.status);
      }
    },
    saleAmount: {
      type: Number,
      ref: "SaleTransaction",
      required: function () {
        return ["Disposed"].includes(this.status);
      }
    },
    saleDate: {
      type: Date,
      ref: "SaleTransaction",
      required: function () {
        return ["Disposed"].includes(this.status);
      }
    },
    requestDate: {
      type: Date,
      ref: "SaleTransaction",
      required: function () {
        return ["Awaiting Disposal", "Disposed"].includes(this.status);
      }
    },
    createdBy: {
      type: String,
      ref: "Employee",
      required: function () {
        return ["Awaiting Disposal", "Disposed"].includes(this.status);
      }
    }
  },


  depreciationDetails: {
    depreciationId: {
        type: String,
        index: { unique: true, sparse: true }
    },
    depreciationMethod: {
        type: String,
        enum: depreciationMethod
    },
    depreciationStartDate: {
        type: Date
    },
    salvageValue: {
        type: Number,
        required: function () {
        return [
            "Straight Line Method",
            "Written Down Method",
            "Units of Production Method",
            "Double Declining Method",
            "Sum-of-the-Years Digits Method"
        ].includes(this.depreciationDetails?.depreciationMethod);
        }
    },
    usefulLifeYears: {
        type: Number,
        required: function () {
        return [
            "Straight Line Method",
            "Double Declining Method",
            "Sum-of-the-Years Digits Method"
        ].includes(this.depreciationDetails?.depreciationMethod);
        }
    },
    depreciationRate: {
        type: Number,
        required: function () {
        return this.depreciationDetails?.depreciationMethod === "Written Down Method";
        }
    },
    totalExpectedUnits: {
        type: Number,
        required: function () {
        return this.depreciationDetails?.depreciationMethod === "Units of Production Method";
        }
    },
    actualUnitsUsed: {
        type: Number,
        required: function () {
        return this.depreciationDetails?.depreciationMethod === "Units of Production Method";
        }
    },
    annualDepreciation: { 
        type: Number 
    }, // to be calculated and stored
    currentBookValue: { 
        type: Number 
    },   // to be calculated and updated
    depreciatedPercentage: { 
        type: Number 
    }, // % till date
    notes: { 
        type: String,
        trim : true  
    },
    createdBy: {
        type: String,
        ref: "Employee",
        required: function () {
            return !!this.depreciationId;
        }
    }
  },
  createdBy: {
    type: String,
    ref: "Employee",
    required: true
  },

  updatedBy: {
    type: String,
    ref: "Employee"
  }
}, { timestamps: true });

export const Asset = mongoose.model('Asset',assetSchema);