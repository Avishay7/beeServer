var express = require("express");
var router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ msg: "ChatGPT API Integration!" });
});


router.post("/", async (req, res) => {
  let userMessage = req.body.message
  try {
    // const text = await req.body.text;
    // console.log(text);


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

module.exports = router;
