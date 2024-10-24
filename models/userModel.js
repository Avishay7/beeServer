const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    DisplayName: String,
    email: String,
    password: String,
    role: {
        type: String, default: "user"
    },
    verifictionCode: String,
    verifiction: {
        type: Boolean, default: false
    },
    level: {
        type: String, default: "beginner"
    },
});

exports.UserModel = mongoose.model("users", userSchema);

exports.validUser = (_bodyData) => {

    let joiSchema = Joi.object({
        FirstName: Joi.string().min(2).max(99).required(),
        LastName: Joi.string().min(2).max(99).required(),
        DisplayName: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(5).max(99).email().required(),
        password: Joi.string().min(2).max(99).required(),
    });

    return joiSchema.validate(_bodyData);
};

exports.validateLogin = (_bodyReq) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required(),
    })
    return joiSchema.validate(_bodyReq);
}

exports.genToken = (_userId, _role) => {
    let token = jwt.sign({ _id: _userId, role: _role }, process.env.JWT_SECRET, { expiresIn: "1440000mins" });
    return token;
}
