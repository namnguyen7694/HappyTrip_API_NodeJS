const _ = require('lodash');
const validator = require('validator');

module.exports.validateLoginUser = (req, res, next) =>{
    const {email, password} = req.body;

    let errors = {};

    //email
    if(!email) {
        errors.email = "Email is requied"
    } else if (!validator.isEmail(email)) {
        errors.email = "Email is invalid"
    } 
    //password
    if (!password) {
        errors.password = "Password is required"
    }
 

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}