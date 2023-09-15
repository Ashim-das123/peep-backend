import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({

    body: {
        type: String,
        required: true
    },
    photo: {
        type: String, // user er photo onno jatgay  upload kore link ta db te save korbo.
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: "users" // model.js a j name ache stai hbe
    }],
    comments: [{
        comment: { type: String },
        postedBy: { type: ObjectId, ref: "users" }
    }],
    postedBy: {
        type: ObjectId,  // ObjectId akta data type ata use korar jonno upore import korte hoy 
        ref: "users"
    }
}, { timestamps: true }) // timestamp object ta jokhon kono pic post hbe tar sathe time reord thakbe er dara latest pic ta render korbo


const post = mongoose.model('posts', postSchema);
export default post;