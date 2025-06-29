import mongoose , {Schema} from 'mongoose';

const enteredAssetSchema = new Schema({
    linked_asset_id : {
        type : mongoose.Schema.Types.objectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    quantity : {
        type : mongoose.Schema.Types.objectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    transaction_id : {
        type : mongoose.Schema.Types.objectId,
        ref : 'PurchaseTransaction',
        required :true
    }, 
    total_amount : {
        type : mongoose.Schema.Types.objectId,
        ref : 'PurchaseTransaction',
        required :true
    },
    cost_per_unit : { // automatically computed by dividing total amount by quantity
        type : decimal
    },
    vendor : {
        type : mongoose.Schema.Types.objectId,
        ref : 'PurchaseTransaction',
        required :true
    } // created on is entered from timestamps 
} , {timestamps : true});

export const EnteredAsset = mongoose.model('EnteredAsset' , enteredAssetSchema)