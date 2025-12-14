import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Video } from './video.model';

const likeSchema = new Schema({

    Video:{
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true  
    }
    ,
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
    likedby:{
        type: Schema.Types.ObjectId,   
        ref: "User",
        required: true
    }

},
{ timestamps: true })

//.plugin() is used to add plugins to the schema
likeSchema.plugin(mongooseAggregatePaginate);
export const Like = mongoose.model("Like", likeSchema);


