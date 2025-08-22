const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types;


const commentschema = mongoose.Schema(

    {
        user: { type: ObjectId, ref: "user", required: true },
        text: { type: String, required: true }
    },
    { timestamps: true }

)

const postschema = mongoose.Schema({
    user: { type: ObjectId, ref: "user", required: true },
    imageurl: { type: String, required: true },
    caption: { type: String, default: "" },
    likes: [{ type: ObjectId, ref: "user" }],
    comments: [commentschema]
})

module.exports = mongoose.model("post", postschema)
