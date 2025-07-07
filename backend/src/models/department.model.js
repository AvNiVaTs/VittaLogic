import mongoose, {Schema} from "mongoose";

const departmentSchema = new Schema({
  department_id: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
    index : true
  },
  departmentName: {
    type: String,
    required: true,
    trim: true,
    set: v => v.trim().replace(/\s+/g, ' '),
    validate: {
      validator: v => /^[A-Za-z0-9 &()\-]+$/.test(v),
      message: props => `"${props.value}" is not a valid department name.`,
      index : true
    }
  },
  departmentDescription: {
    type: String,
    trim: true
  },
  createdBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      immutable: true
  },
  updatedBy: { //Middleware
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      immutable: true
  }
}, {timestamps : true});

export const Department = mongoose.model('Department',departmentSchema);