import mongoose, {Schema} from "mongoose";



const assetsSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: true,
    unique: true
  },
  assigned_to: {
    type: String,
    ref: 'Employees',
    required: true  //will all assets be assigned? what about fixed assets like land? //multiple references possible? 
  },
  entered_by: {
    type: String,
    ref: 'Employees',
    required: true
  },
  asset_name: {
    type: String,
    required: true,
    trim: true
  },
  asset_type: {
    type: String,  //i think it should be enum type while having string in asset_sub_type
    required: true  
  },
  asset_sub_type:{
    type: String,
    required: true
  },
  purchase_date: {
    type: Date,
    required: true
  },
  depreciation: {
    type: String,
    required: false  //create another column for appreciation? but that would also require a appreciation table 
     //add a boolean col
  },
  expected_life_years: {
    type: String,
    required: false
  },
  current_status: {
    type: String,   //it should be enum???[operational, not operational, requires maintenance, etc]
    required: true
  },
  department_id: {
    type: String,
    required: true,
    ref: 'Departments'
  },
  transaction_id: {
    type: String,
    required: true,
    ref: 'Transactions'
  }
});

export const asset = mongoose.model('Assets',assetsSchema);