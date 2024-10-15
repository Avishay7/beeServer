var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ msg: "Work from chat test" });
});

router.post("/", async (req, res) => {
  try {
    const text = await req.body.text;
    console.log(text);

    //   const sendChat = await sendChat(text);
    //   return res.status(200).json(sendChat);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
