var express = require("express");
var router = express.Router();
const OpenAI = require("openai");
const { auth, authAdmin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { ChatModel } = require("../models/chatModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ msg: "ChatGPT API Integration!" });

});




router.get("/allChats/:userId", auth, async (req, res) => {
  try {
    let userId = req.params.userId;
    let data = await ChatModel.find({ user_id: userId });
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


// chat
router.post("/", async (req, res) => {
  let userMessage = req.body.message
  try {
    // שליחת ההודעה ל-GPT
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // מודל השימוש
      messages: [{ role: "user", content: userMessage }], // הכנסת ההודעה המבוקשת
    });

    const chatResponse = response.choices[0].message.content; // קבלת התגובה מ-ChatGPT
    return res.json({ response: chatResponse }); // שליחת התגובה חזרה ללקוח
  } catch (error) {
    res.status(500).send(error.message); // טיפול בשגיאה
  }
});


// add Chat to DB
router.post("/addChat", auth, async (req, res) => {
  let token = req.header("x-api-key");
  let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  let token_id = decodeToken._id;
  let _Body = req.body;
  _Body.user_id = token_id
  console.log(_Body);
  try {
    let newChat = new ChatModel(_Body);
    console.log(newChat);
    await newChat.save();
    return res.status(201).json(newChat);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});









module.exports = router;
