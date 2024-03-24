import { Schema , model } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const photoSchema = new Schema({
    photoURL: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

photoSchema.plugin(mongooseAggregatePaginate)

export const Photo = model('Photo' , photoSchema);