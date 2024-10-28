const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({
    user_id: String,
    level: String,
    time:String,
    date_created: { type: Date, default: Date.now() },
});

exports.ChatModel = mongoose.model("chats", chatSchema);