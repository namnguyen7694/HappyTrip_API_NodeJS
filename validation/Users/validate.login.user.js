const _ = require('lodash');
const validator = require('validator');

module.exports.validateLoginUser = (req, res, next) =>{
    const {email, password} = req.body;

    let errors = {};

    //email
    if(!email) {
        errors.email = "Chưa nhập thông tin Email"
    } else if (!validator.isEmail(email)) {
        errors.email = "Email không hợp lệ"
    } 
    //password
    if (!password) {
        errors.password = "Chưa nhập mật khẩu"
    }
 

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}