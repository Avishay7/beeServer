var express = require("express");
const { UserModel, validUser, validateLogin, genToken } = require("../models/userModel");
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
var router = express.Router();
const sendMail = require("../middlewares/sendMail");
const { auth, authAdmin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

/* GET users list. */
router.get("/",authAdmin, async (req, res) => {
  let data = await UserModel.find({});
  res.json(data);
});


/* GET single user by id */
router.get("/single/:userId",authAdmin , async (req, res) => {
  try {
    let userId = req.params.userId;
    let data = await UserModel.findOne({ _id: userId });
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


/* GET single user by token */
router.get("/myInfo", auth, async (req, res) => {
  let token = req.header("x-api-key");
  let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  let token_id = decodeToken._id;
  try {
    let data = await UserModel.findOne({ _id: token_id }, { password: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// check if the user have a good token 
router.get("/checkToken", auth, async (req, res) => {
  res.json(true)
})

// Checks if the user Token is an admin
router.get("/checkTokenAdmin", authAdmin, async (req, res) => {
  res.json(true)
})

/* Users signup. */
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.verifictionCode = (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    let emailExists = await UserModel.findOne({ email: user.email });
    if (emailExists) {
      return res.json({ err: "The email already exists" });
    }
    await sendMail(user.email, "code", user.verifictionCode);
    await user.save();
    user.password = "****";
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ err: "Email not found!" });
    }
    if (!user.verifiction) {
      return res.status(401).json({ err: "Email not verified!" });
    }
    if (req.body.password != user.password) {
      return res.status(401).json({ err: "Email or password is wrong" });
    }
    res.json({ token: genToken(user._id, user.role) });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// verification code
router.patch("/verification", async (req, res) => {
  try {
    let thisEmail = req.body.email;
    let thisVerifictionCode = req.body.verifictionCode;
    let user = await UserModel.findOne({ email: thisEmail });
    if (user.verifictionCode != thisVerifictionCode) {
      return res.json("Incorrect code");
    }
    user.verifiction = true;
    user.verifictionCode = (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    let data = await UserModel.updateOne({ _id: user._id }, user);
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// Forgot password 
router.patch("/forgotpass", async (req, res) => {
  try {
    let thisEmail = req.body.email;
    let user = await UserModel.findOne({ email: thisEmail });
    user.verifictionCode = (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    await sendMail(user.email, "verifiction code to beelingual", user.verifictionCode);
    let data = await UserModel.updateOne({ _id: user._id }, user);
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// User authentication before password change
router.patch("/validation", async (req, res) => {
  try {
    let thisEmail = req.body.email;
    let thisVerifictionCode = req.body.validationCode;
    let user = await UserModel.findOne({ email: thisEmail });
    if (!user) {
      return res.status(401).json({ err: "Email not found. Return to  forgot password page !"});
    }
    if (user.verifictionCode != thisVerifictionCode) {
      return res.json("Incorrect code");
    }
    user.verifictionCode = (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    let data = await UserModel.updateOne({ _id: user._id }, user);
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

//  change password
router.patch("/changePass", async (req, res) => {
  try {
    let thisEmail = req.body.email;
    let newPass = req.body.password;
    let user = await UserModel.findOne({ email: thisEmail });
    if (!user) {
      return res.status(401).json({ err: "Email not found. Return to  forgot password page !" });
    }
    user.password = newPass
    let data = await UserModel.updateOne({ _id: user._id }, user);
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// Update level
router.put("/level", auth , async (req, res) => {
  let thisLevel = req.body.level; 
  console.log(thisLevel);
  let token = req.header("x-api-key");
  let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  let token_id = decodeToken._id;
  try {
    let user = await UserModel.findOne({ _id: token_id });
    user.level = thisLevel ;
    let updateData = await UserModel.updateOne({ _id: token_id }, user);
    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }

})



// Update for user
router.put("/edit", auth, async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let token_id = req.userToken.id;
    let updateData = await UserModel.updateOne({ _id: token_id }, req.body)
    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }

})

//Delete user
router.delete('/:id',authAdmin , async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await UserModel.findByIdAndDelete(userId);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});


module.exports = router;