require("dotenv").config();
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL)

const userschema = mongoose.Schema({
    username:String,
    email:String,
    password:String
})

module.exports = mongoose.model("user" , userschema)
