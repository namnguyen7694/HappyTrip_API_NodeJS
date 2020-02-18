const _ = require('lodash');
const validator = require('validator');

module.exports.validateUpdateUser =  (req, res, next) =>{
    const {password, password2, fullName} = req.body;

    let errors = {};

    //password
    if (!password) {
        errors.password = "Chưa nhập mật khẩu"
    }
    

    //confirm password
    if (!password2) {
        errors.password2 = "Chưa nhập mật khẩu mới"
    }
    else if(!validator.isLength(password2, {min:6})) {
        errors.password = "Mật khẩu phải chứa tối thiểu 6 ký tự"
    }

    //fullName
    if (!fullName) {
        errors.fullName = "Chưa nhập họ tên"
    }

    if(_.isEmpty(errors)) return next()
    return res.status(400).json(errors);
}