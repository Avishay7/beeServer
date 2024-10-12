const router = require("express").Router();
const sendMail = require("../middlewares/sendMail");

router.post("/", async (req, res) => {
  try {
    const email = await req.body.email;
    const message = await req.body.message;
    const subject = await req.body.subject;
    const sentEmail = await sendMail(email, subject, message);
    return res.status(200).send("You email is on the way");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;