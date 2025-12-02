import monogoose ,{Schema} from "mongoose";

const subscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //one who is subscribing
        ref:"User",
        required:true,
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }


},{timestamps:true})

export const subscription=monogoose.model("subscription",subscriptionSchema);