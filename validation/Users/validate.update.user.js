const _ = require('lodash');
const validator = require('validator');
const {User} = require ('../../models/User');

module.exports.validateUpdateUser =  (req, res, next) =>{
    const {password, password2, fullName} = req.body;

    let errors = {};

    //password
    if (!password) {
        errors.password = "Password is required"
    }
    else if(!validator.isLength(password, {min:6})) {
        errors.password = "Password must have at least 6 characters"
    }

    //confirm password
    if (!password2) {
        errors.password2 = "Confirm password is required"
    } else if(!validator.equals(password,password2)) {
        errors.password2 = "Password doesn't match"
    }

    //fullName
    if (!fullName) {
        errors.fullName = "Full name is required"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}