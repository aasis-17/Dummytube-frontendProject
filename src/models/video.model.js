import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile : {
            type : String,
            required : true
        },

        thumnail : {
            type : String,
            reuired : true
        },

        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },

        title : {
            type : String,
            required : true
        },

        description : {
            type : String,
            required : true

        },

        duration : {
            type :Number,
            required : true 
        },

        views : {
            type :Number,
            default : 0
        },

        isPublished : {
            type : Boolean,
            default : true
        },
        
        videoPublic_id :{
            type : String
        },
        
        thumnailPublic_id : {
            type : String
        }
    },{timestamps : true}
)

    videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)