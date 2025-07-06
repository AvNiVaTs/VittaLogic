import mongoose , {Schema} from 'mongoose';

const decimal = mongoose.Schema.Types.Decimal128;

const enteredAssetSchema = new Schema({
    asset_name : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseTransaction'
    },
    linked_reference_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    quantity : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    transaction_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    }, 
    total_amount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    cost_per_unit : { // automatically computed by dividing total amount by quantity
        type : decimal,
        required: true,
        immutable: true
    },
    purchase_date: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    vendor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PurchaseTransaction',
        required :true
    } // created on is entered from timestamps 
} , {timestamps : true});

export const EnteredAsset = mongoose.model('EnteredAsset' , enteredAssetSchema)