// reference_type
// liability_id

import mongoose, { Schema } from "mongoose";

const internalTransactionSchema = new Schema({})

export const InternalTransaction = mongoose.model('InternalTransaction' , internalTransactionSchema)